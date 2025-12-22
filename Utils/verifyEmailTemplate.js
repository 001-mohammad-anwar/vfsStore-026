const verifyEmailTemplate = ({ username, url }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 flex items-center justify-center py-10">
        <div class="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 class="text-2xl font-bold text-gray-800">Verify Your Email</h2>
            <p class="text-gray-600 mt-4">Dear <span class="font-semibold">${username}</span>,</p>
            <p class="text-gray-600 mt-2">
                Thank you for registering with <span class="font-semibold text-blue-600">Binkeyit</span>.  
                To complete your sign-up, please verify your email by clicking the button below.
            </p>
            <a href="${url}" 
               class="inline-block bg-blue-500 text-white font-semibold px-6 py-3 mt-5 rounded-lg shadow-md 
                      hover:bg-blue-600 transition">
                Verify Email
            </a>
            <p class="text-gray-500 text-sm mt-5">
                If you did not sign up, you can safely ignore this email.
            </p>
            <div class="border-t mt-6 pt-4 text-gray-400 text-xs">
                © ${new Date().getFullYear()} Binkeyit. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = verifyEmailTemplate;
