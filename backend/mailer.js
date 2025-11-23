import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bacem123gh@gmail.com',       // حط هنا إيميلك
    pass: 'qdfp ywvn noja zyvr' // هنا تحط الباسورد اللي عملته من Google
  }
});

export const sendMail = async (to, subject, text) => {
  await transporter.sendMail({
    from: 'bacem123gh@gmail.com',
    to,
    subject,
    text
  });
};
