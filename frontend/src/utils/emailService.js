// src/utils/emailService.js
export const EMAILJS_SERVICE_ID  = 'service_020rwbg';
export const EMAILJS_TEMPLATE_ID = 'template_2c14euf';
export const EMAILJS_PUBLIC_KEY  = 'u2JbPMEZmX1cjLjMa';

/**
 * Send email using EmailJS send() — works on any domain (no whitelist needed)
 */
export const sendContactEmail = async (formRef, onSuccess, onError) => {
  try {
    const emailjs = await import('@emailjs/browser');

    // Extract values directly from the form ref
    const formData = new FormData(formRef.current);
    const templateParams = {
      name:    formData.get('name')    || '',
      email:   formData.get('email')   || '',
      subject: formData.get('subject') || '',
      message: formData.get('message') || '',
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    onSuccess();
  } catch (error) {
    console.error('EmailJS Error:', error);
    onError(error);
  }
};
