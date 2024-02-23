const { env } = process as { env: { [key: string]: string } };

export const { PG_URL, MAIL_USER, MAIL_PASS, SIGN_UP_ACTIVATION_SECRET } = env;