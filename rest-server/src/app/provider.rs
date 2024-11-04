use axum::http::StatusCode;
use oauth2::basic::BasicTokenResponse;
use oauth2::url::Url;
use oauth2::{Client, CsrfToken, Scope};

use crate::json::error::ApiError;
use common::settings::secrets::{OauthSecret, Secrets};

#[derive(Clone)]
pub struct OAuthProvider {
    pub google: Provider,
    pub facebook: Provider,
    pub linkedin: Provider,
}

#[derive(Clone)]
pub struct Provider {
    pub client: OauthClient,
    pub info: String,
    scopes: Vec<Scope>,
}

impl OAuthProvider {
    pub fn new(secrets: &Secrets, proxy: String) -> Self {
        Self {
            google: Provider::new(
                Self::oauth_client(
                    &secrets.google,
                    "https://accounts.google.com/o/oauth2/v2/auth",
                    "https://www.googleapis.com/oauth2/v3/token",
                    format!("http://{proxy}/access/signup?oauth_type=google"),
                ),
                "https://www.googleapis.com/oauth2/v3/userinfo".to_string(),
                vec!["email", "profile"],
            ),
            facebook: Provider::new(
                Self::oauth_client(
                    &secrets.facebook,
                    "https://www.facebook.com/v20.0/dialog/oauth",
                    "https://graph.facebook.com/oauth/access_token",
                    format!("http://{proxy}/access/signup?oauth_type=facebook"),
                ),
                "https://graph.facebook.com/me?fields=name,email,picture".to_string(),
                vec!["email"],
            ),
            linkedin: Provider::new(
                Self::oauth_client(
                    &secrets.linkedin,
                    "https://www.linkedin.com/oauth/v2/authorization",
                    "https://www.linkedin.com/oauth/v2/accessToken",
                    format!("http://{proxy}/access/signup?oauth_type=linkedin"),
                ),
                "https://api.linkedin.com/v2/userinfo".to_string(),
                vec!["profile", "email", "openid"],
            ),
        }
    }

    fn oauth_client(
        secret: &OauthSecret,
        auth_url: &str,
        token_url: &str,
        redirect_url: String,
    ) -> OauthClient {
        oauth2::basic::BasicClient::new(oauth2::ClientId::new(secret.client_id.to_string()))
            .set_client_secret(oauth2::ClientSecret::new(secret.client_secret.to_string()))
            .set_auth_uri(oauth2::AuthUrl::new(auth_url.to_string()).unwrap())
            .set_token_uri(oauth2::TokenUrl::new(token_url.to_string()).unwrap())
            .set_redirect_uri(oauth2::RedirectUrl::new(redirect_url).unwrap())
    }

    pub fn get_provider(&self, oauth_type: &str) -> &Provider {
        match oauth_type {
            "google" => &self.google,
            "facebook" => &self.facebook,
            _ => &self.linkedin
        }
    }
}

impl Provider {
    pub fn new(client: OauthClient, info: String, scopes: Vec<&str>) -> Self {
        Self {
            client,
            info,
            scopes: scopes.iter().map(|s| Scope::new(s.to_string())).collect(),
        }
    }

    pub fn auth_url(&self) -> ((Url, CsrfToken), oauth2::PkceCodeVerifier) {
        let (pkce_code_challenge, pkce_code_verifier) = oauth2::PkceCodeChallenge::new_random_sha256();

        (
            self.client
                .authorize_url(CsrfToken::new_random)
                .set_pkce_challenge(pkce_code_challenge)
                .add_scopes(self.scopes.clone())
                .url(),
            pkce_code_verifier
        )
    }

    pub async fn get_token(&self, code: String, pkce_code_verifier: oauth2::PkceCodeVerifier) -> Result<BasicTokenResponse, ApiError> {
        self.client
            .exchange_code(oauth2::AuthorizationCode::new(code))
            .set_pkce_verifier(pkce_code_verifier)
            .request_async(
                &oauth2::reqwest::Client::builder()
                    .redirect(oauth2::reqwest::redirect::Policy::limited(1))
                    .build().unwrap()
            )
            .await
            .map_err(|e| {
                println!("{e:?}");
                ApiError::Custom(StatusCode::INTERNAL_SERVER_ERROR, format!("{e:?}"))
            })
    }

    pub async fn get_user<T: serde::de::DeserializeOwned>(&self, token: &String) -> T {
        reqwest::Client::new()
            .get(&self.info)
            .bearer_auth(token)
            .send()
            .await
            .unwrap()
            .json()
            .await
            .unwrap()
    }
}

pub type OauthClient = Client<oauth2::basic::BasicErrorResponse, oauth2::basic::BasicTokenResponse, oauth2::basic::BasicTokenIntrospectionResponse, oauth2::StandardRevocableToken, oauth2::basic::BasicRevocationErrorResponse, oauth2::EndpointSet, oauth2::EndpointNotSet, oauth2::EndpointNotSet, oauth2::EndpointNotSet, oauth2::EndpointSet>;