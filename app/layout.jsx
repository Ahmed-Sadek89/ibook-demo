import MainLayout from "../components/Layout/main-layout";
import "../styles/globals.scss";

// export const metadata = {
//   title: "IBook",
//   description: "Generated by IBook",
//   icons: [
//     {
//       url: "/book.png",
//       href: "/book.png"
//     }
//   ]
// };

const APP_NAME = "IBook";
const APP_DEFAULT_TITLE = "IBook";
const APP_TITLE_TEMPLATE = "IBook";
const APP_DESCRIPTION = "IBook";

export const metadata = {
  applicationName: "IBook",
  title: "IBook",
  description: "Generated by IBook",
  icons: [
    {
      url: "/book.png",
      href: "/book.png"
    }
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport = {
  themeColor: "#FFFFFF",
};
export default function RootLayout({ children }) {

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="shortcut icon" href="/book.png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        ></link>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  )
}
