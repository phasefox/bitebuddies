// EmailJS Configuration
// You'll need to set up EmailJS at https://www.emailjs.com/
// 
// Required Environment Variables:
// VITE_EMAILJS_SERVICE_ID=your_service_id
// VITE_EMAILJS_TEMPLATE_ID=your_template_id  
// VITE_EMAILJS_PUBLIC_KEY=your_public_key
// VITE_EMAIL_TO=your_email@example.com
//
// EmailJS Template Variables:
// {{to_email}} - The email address to send to
// {{restaurant_name}} - Name of the restaurant
// {{review_text}} - The review text
// {{rating}} - Star rating (1-5)
// {{created_at}} - When the review was created
// {{message}} - Formatted message with all details

export const emailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  toEmail: import.meta.env.VITE_EMAIL_TO,
};

// Example EmailJS Template:
/*
Subject: New Review Received - {{restaurant_name}}

Hi,

A new review has been received:

Restaurant: {{restaurant_name}}
Rating: {{rating}} stars
Review: {{review_text}}
Date: {{created_at}}

Best regards,
Bite Buddies Review System
*/ 