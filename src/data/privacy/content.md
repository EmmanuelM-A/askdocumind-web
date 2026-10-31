# Privacy Policy

Last updated: July 2026

## 1. Overview

AskDocuMind is a document question-answering service. We are committed to handling your data minimally and transparently. This policy explains what we collect, how we use it, and how long we keep it.

## 2. What data we collect

**We do not require an account!** You use AskDocuMind anonymously. The data we collect is the following:

- **Session identifier**: A randomly generated ID stored in a secure, HttpOnly cookie. It contains no personal information and is used solely to associate your uploads and messages with your session.
- **Uploaded documents**: The files you upload are stored temporarily for processing and answer generation. Their text content is extracted and converted into numerical vectors for search.
- **Chat messages**: Your questions and the AI-generated answers are stored within your session to maintain conversation context.
- **Technical logs**: Server logs may record request paths, HTTP status codes, and response times. These do not include the content of your queries or documents.

**We do not collect** your name, email address, IP address (beyond what is processed transiently by our hosting infrastructure), or any other personally identifiable information.

## 3. How uploaded documents are handled

- Documents are uploaded to our servers and stored temporarily for the duration of your session.
- The text content of your documents is extracted and split into chunks, which are embedded as vectors and stored in our database to enable semantic search.
- Your documents and their vector representations are deleted automatically when your session expires (see section 4).
- The text content of your documents is sent to OpenAI's API to generate answers. OpenAI's data usage policies apply to this processing.
- If web search is enabled and your query cannot be answered from your documents, your query text is sent to Brave Search API to retrieve relevant web results.

## 4. Retention periods

| Data                           | Retention                     |
| ------------------------------ | ------------------------------|
| Session cookie                 | 1 hour from last activity     |
| Uploaded documents (files)     | Deleted when session expires  |
| Document vectors (embeddings)  | Deleted when session expires  |
| Chat messages                  | Deleted when session expires  |
| Server logs                    | Up to 30 days                 |

Sessions inactive for more than 1 hour are purged automatically by a background cleanup process.

## 5. Third-party services

| Service       | Purpose                                        | Privacy policy                                                                    |
|---------------|------------------------------------------------|-----------------------------------------------------------------------------------|
| OpenAI        | LLM response generation and document embedding | [openai.com/policies](https://openai.com/policies)                                |
| Brave Search  | Optional web search fallback                   | [brave.com/privacy-policy](https://api-dashboard.search.brave.com/privacy-policy) |
| Railway       | Backend hosting and database                   | [railway.app/legal/privacy](https://railway.app/legal/privacy)                    |
| Cloudflare    | CDN, DNS, and DDoS protection                  | [cloudflare.com/privacypolicy](https://www.cloudflare.com/)                       |
| Vercel        | Frontend hosting                               | [vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy)        |

## 6. Cookies

We use a single cookie (`askdocumind_user_cookie`) to maintain your anonymous session. It is:

- **HttpOnly**: Not accessible to JavaScript
- **Secure**: Transmitted over HTTPS only
- **SameSite=None**: Required for cross-origin requests between the frontend and backend

We do not use advertising cookies, analytics cookies, or any third-party tracking cookies.

## 7. Your rights

Because we do not collect personal data and sessions are anonymous, there is no personal profile to access, correct, or delete. Your data is deleted automatically when your session expires. If you wish to remove your data immediately, clearing your browser cookies ends your session and the associated data will be purged on the next cleanup cycle.

## 8. Contact

For privacy-related questions, contact: [madukaagbeze.ea@gmail.com](mailto:madukaagbeze.ea@gmail.com)
