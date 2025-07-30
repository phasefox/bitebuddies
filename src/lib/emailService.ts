import emailjs from '@emailjs/browser';

interface EmailData {
  restaurant_name: string;
  review_text: string;
  rating: number;
  poll_answer: "yes" | "no" | null;
  created_at: string;
}

export const sendReviewEmail = async (data: EmailData) => {
  try {
    const templateParams = {
      to_email: import.meta.env.VITE_EMAIL_TO || 'default@example.com',
      restaurant_name: data.restaurant_name,
      review_text: data.review_text,
      rating: data.rating,
      poll_answer: data.poll_answer,
      created_at: data.created_at,
      message: `New review received for ${data.restaurant_name} with ${data.rating} stars: ${data.review_text}`,
      // HTML template variables
      name: data.restaurant_name,
      time: new Date(data.created_at).toLocaleString(),
      stars: '⭐'.repeat(data.rating) + '☆'.repeat(5 - data.rating)
    };

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service',
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'default_template',
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'default_key'
    );

    return { success: true, response };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}; 