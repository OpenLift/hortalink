// https://github.com/nurmohammed840/websocket.rs/blob/main/examples/utils/handshake.rs

use std::io::ErrorKind;

use sha1::Digest;

use crate::http::request;
use crate::http::request::HttpRequest;

pub const MAGIC_STRING: &[u8; 36] = b"258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

fn accept_key_from(sec_ws_key: impl AsRef<[u8]>) -> String {
    let mut sha1 = sha1::Sha1::new();
    sha1.update(sec_ws_key.as_ref());
    sha1.update(MAGIC_STRING);

    base64::Engine::encode(&base64::prelude::BASE64_STANDARD, sha1.finalize())
}

fn response(
    sec_ws_key: impl AsRef<[u8]>,
    headers: impl IntoIterator<Item=impl super::request::Header>,
) -> String {
    let key = accept_key_from(sec_ws_key);
    let headers: String = headers
        .into_iter()
        .map(|f| super::request::Header::fmt(&f))
        .collect();

    format!("HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: {key}\r\n{headers}\r\n")
}

async fn build<IO>(reader: &mut IO) -> std::io::Result<String>
where
    IO: Unpin + tokio::io::AsyncBufRead,
{
    let req = HttpRequest::parse(reader).await?;

    let key = request::get_sec_key(&req).ok_or(std::io::Error::new(
        ErrorKind::InvalidData,
        "security key not found",
    ))?;

    Ok(response(key, [("x-agent", "web-socket")]))
}

pub async fn send<Reader, Writer>(reader: &mut Reader, writer: &mut Writer) -> std::io::Result<()>
where
    Reader: Unpin + tokio::io::AsyncBufRead,
    Writer: Unpin + tokio::io::AsyncWrite,
{
    let response = build(reader).await?;
    tokio::io::AsyncWriteExt::write_all(writer, response.as_bytes()).await?;

    Ok(())
}