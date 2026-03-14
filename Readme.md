# 📚 MyLibrary (Premium Edition)

MyLibrary is a sleek, modern, and fully responsive library management web application built with Node.js, Express, and MongoDB. It demonstrates full CRUD operations for managing books and authors, featuring advanced UI aesthetics, image uploading, and database protection mechanisms designed for safe public deployment.

---

## ✨ Key Features

- **Premium UI/UX:** 
  - Complete dark theme (Obsidian, Teal, and Warm Gold gradient accents).
  - Glassmorphism effects with modern, floating card designs.
  - Fully responsive layout featuring a fixed left sidebar on desktop and a smooth hamburger menu on mobile devices.
  - Custom SVG branding and typography.

- **Author & Book Management (CRUD):**
  - Add, update, and delete authors and books dynamically.
  - View individual author profiles and all books published by them.

- **Advanced Image Handling:**
  - Integrated with **FilePond** for seamless Drag & Drop image uploads.
  - Images are base64-encoded, resized, and saved directly into the MongoDB document block.

- **🛡️ Database Protection & Demo Mode:**
  - **Size Limits:** Hard-capped image file size limits (~500KB) to protect database storage.
  - **Count Limits:** Prevents users from adding more than 100 books to protect the free MongoDB tier.
  - **Protected Data:** Includes an `isProtected` boolean flag on specific books/authors. Protected entries hide the "Edit" and "Delete" buttons from the public UI and block modification requests at the route level.

- **Automated Seeding:**
  - A robust `seedData.js` script that uses public APIs to automatically download and seed 10 classic/technical books (with their covers) into your database as unmodifiable protected instances.

---

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose ODM
- **Frontend Template:** EJS (Embedded JavaScript templates)
- **Styling:** Vanilla CSS (Variables, Grid, Flexbox, Media Queries)
- **File Upload:** FilePond, Base64 Encoding
- **Deployment:** Vercel Serverless Ready (`vercel.json`)

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/prashantsaini1525/MyLibrary.git
   cd MyLibrary
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   Create a `.env` file in the root directory and add your MongoDB connection string:
   ```env
   DATABASE_URL=your_mongodb_connection_string
   PORT=3000
   ```

4. **Seed the Database (Optional but Recommended):**
   Run the seeding script to populate your database with 10 high-quality, protected demo books:
   ```bash
   node seedData.js
   ```

5. **Run the Application locally:**
   ```bash
   npm run devStart
   ```
   Open your browser and navigate to `http://localhost:3000`.

---

## 🌐 Deploying to Vercel

This repository is pre-configured to be deployed natively on Vercel as Serverless Functions. 
1. Import the repository into your Vercel Dashboard.
2. Under "Environment Variables", add the `DATABASE_URL` key and provide your MongoDB connection string.
3. Deploy! Vercel handles the Express routing using the `server.js` export mapping and `vercel.json`.

---

## 🤝 Contributing
Contributions are welcome! Feel free to fork the repository, open pull requests, or submit issues with suggestions.

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.