// src/utils/emailService.js
// REPLACE the values below with your actual EmailJS credentials
// Get them from https://www.emailjs.com/

export const EMAILJS_SERVICE_ID  = 'service_020rwbg';
export const EMAILJS_TEMPLATE_ID = 'template_c07tssu';
export const EMAILJS_PUBLIC_KEY  = 'u2JbPMEZmX1cjLjMa';

/**
 * Send email using EmailJS
 * @param {React.RefObject} formRef - Reference to the form element
 * @param {Function} onSuccess - Callback on success
 * @param {Function} onError - Callback on error
 */
export const sendContactEmail = async (formRef, onSuccess, onError) => {
  try {
    const emailjs = await import('@emailjs/browser');
    await emailjs.sendForm(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      formRef.current,
      EMAILJS_PUBLIC_KEY
    );
    onSuccess();
  } catch (error) {
    console.error('EmailJS Error:', error);
    onError(error);
  }
};
