# Privacy Policy

Last updated: October 2026

## 1. Overview

AskDocuMind is a document question-answering demo. We collect as little data as we can and keep it only as long as it's needed. This policy explains what we collect, how we use it, and how long we keep it.

## 2. What data we collect

**You don't need an account.** You use AskDocuMind anonymously, and we collect only the following:

- **Session identifier**: A randomly generated ID stored in a secure, HttpOnly cookie. It contains no personal information and is used only to link your uploads and chats to your session.
- **Uploaded documents**: The files you upload, and the text extracted from them. The text is split into chunks and turned into numerical vectors so it can be searched.
- **Chat messages**: Your questions are sent to the API to generate answers. Your conversation is also saved in your browser so it is still there when you come back, and it is replaced when you start a new chat. Any questions and answers stored on our side are deleted along with your chat.
- **Technical logs**: Server logs may record request paths, HTTP status codes and response times. They don't include the content of your questions or documents.

**We do not collect** your name, email address, IP address (beyond what our hosting providers process briefly to deliver the site), or any other personally identifiable information.

## 3. How uploaded documents are handled

- Uploaded files are stored in object storage for as long as your session exists.
- In the background, the text of each file is extracted, split into chunks and converted into vectors, which are stored in our database for search.
- To embed your documents and answer your questions, relevant text is sent to OpenAI's API. OpenAI's data usage policies apply to this processing.
- If you turn on web search and your documents don't contain enough to answer, your question is sent to the Brave Search API to find relevant web pages.
- You can delete a document, all documents in a chat, or the whole chat at any time from the demo.

## 4. Retention periods

| Data                           | Retention                                         |
| ------------------------------ | ------------------------------------------------- |
| Session cookie                 | 1 hour, renewed while you use the demo            |
| Uploaded files                 | Until you delete them or your session is removed  |
| Document text and vectors      | Until you delete them or your session is removed  |
| Chat messages                  | Until you delete the chat or your session is removed |
| Server logs                    | Up to 30 days                                     |

Sessions that have been inactive are removed automatically by a scheduled cleanup job, together with their chats, stored files and database records.

## 5. Third-party services

| Service       | Purpose                                         | Privacy policy                                                                    |
|---------------|-------------------------------------------------|-----------------------------------------------------------------------------------|
| OpenAI        | Document embeddings and answer generation       | [openai.com/policies](https://openai.com/policies)                                |
| Brave Search  | Optional web search                             | [brave.com/privacy-policy](https://api-dashboard.search.brave.com/privacy-policy) |
| Railway       | Backend hosting and file storage                | [railway.com/legal/privacy](https://railway.com/legal/privacy)                    |
| Neon          | Database hosting                                | [neon.com/privacy-policy](https://neon.com/privacy-policy)                        |
| Cloudflare    | CDN, DNS and DDoS protection                    | [cloudflare.com/privacypolicy](https://www.cloudflare.com/privacypolicy/)         |
| Vercel        | Frontend hosting                                | [vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy)        |

## 6. Cookies

We use a single cookie (`anonymous_session`) to keep your anonymous session. It is:

- **HttpOnly**: Not accessible to JavaScript
- **Secure**: Sent over HTTPS only
- **SameSite=Strict**: Sent only on requests from askdocumind.com to its own API

We also use your browser’s local storage to remember your light or dark theme and your current conversation. This data stays on your device and is not sent to us.

We do not use advertising, analytics or third-party tracking cookies.

## 7. Your rights

Because sessions are anonymous and we don't collect personal data, there is no personal profile to access or correct. You can delete your documents and chats yourself at any time from the demo. Anything left behind is deleted automatically once your session has been inactive long enough to be cleaned up.

## 8. Contact

For privacy-related questions, contact: [madukaagbeze.ea@gmail.com](mailto:madukaagbeze.ea@gmail.com)
