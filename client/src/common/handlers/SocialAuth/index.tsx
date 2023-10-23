import {
  API_URLS,
  GITHUB_OAUTH_URL,
  GOOGLE_OAUTH_URL,
} from "../../../constants";

export const onGoogleClick = () => {
  window.open(
    GOOGLE_OAUTH_URL,
    "popup",
    "location=yes,height=570,width=520,scrollbars=yes,status=yes,popup=yes"
  );

  var timer = setInterval(checkOAuthStatusCookie, 500);

  function checkOAuthStatusCookie() {
    const cookie =
      document.cookie.match(
        `(?<=; oauth_status=|^oauth_status=)[\\w.-]+`
      )?.[0] || "0";

    if (cookie === "1") {
      window.location.href = API_URLS.local.CHAT_DASHBOARD();
      clearInterval(timer);
    }
  }
};

export const onGithubClick = () => {
  window.open(
    GITHUB_OAUTH_URL,
    "popup",
    "location=yes,height=570,width=520,scrollbars=yes,status=yes,popup=yes"
  );

  var timer = setInterval(checkOAuthStatusCookie, 500);

  function checkOAuthStatusCookie() {
    const cookie =
      document.cookie.match(
        `(?<=; oauth_status=|^oauth_status=)[\\w.-]+`
      )?.[0] || "0";

    if (cookie === "1") {
      window.location.href = API_URLS.local.CHAT_DASHBOARD();
      clearInterval(timer);
    }
  }
};
