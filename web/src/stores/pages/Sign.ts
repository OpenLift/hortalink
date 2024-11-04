import { atom } from "nanostores";

enum SignUpFormView {
    Credentials = 1,
    Profile
}

export {
    SignUpFormView
}

export default {
    SignUpFormView: atom<SignUpFormView>(SignUpFormView.Credentials),
    SignUpDefaultProfileUrl: atom<string>(""),
    SignUpCropperOpen: atom<boolean>(false),
}