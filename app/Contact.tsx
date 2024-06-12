// "use client";
// import React, { useRef, FormEvent } from "react";
// import emailjs from "@emailjs/browser";

// const Contact: React.FC = () => {
//   const form = useRef<HTMLFormElement>(null);

//   const sendEmail = (e: FormEvent) => {
//     e.preventDefault();

//     if (form.current) {
//       emailjs
//         .sendForm(
//           "YOUR_SERVICE_ID",
//           "YOUR_TEMPLATE_ID",
//           form.current,
//           "YOUR_PUBLIC_KEY"
//         )
//         .then(
//           () => {
//             console.log("SUCCESS!");
//           },
//           (error: any) => {
//             console.log("FAILED...", error.text);
//           }
//         );
//     }
//   };

//   return (
//     <form ref={form} onSubmit={sendEmail}>
//       <label>Name</label>
//       <input type="text" name="user_name" required />
//       <label>Email</label>
//       <input type="email" name="user_email" required />
//       <label>Message</label>
//       <textarea name="message" required />
//       <input type="submit" value="Send" />
//     </form>
//   );
// };

// export default Contact;
