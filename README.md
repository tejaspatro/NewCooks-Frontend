# NewCooks Frontend

This is the frontend of **NewCooks** — a modern recipe-sharing platform where **Chefs** can manage their recipes and **Users** can browse, favorite, and explore recipes through a beautiful and responsive interface.

## 🚀 Features

- Built with **React** and **Vite** for fast, modern development
- Responsive design using **Bootstrap**, custom **HTML/CSS**, and icon components
- **Cloudinary** used for image upload and storage
- Smooth UI components for navigation, icons, and responsive behavior
- Pinchofyum.com & CodeWithHarry.com served as inspiration for UI and UX design
- Separate interface flows for Users and Chefs:
    - **Chef Interface**: Manage recipes (Add, Edit, Delete), View Stats, Upload images
    - **User Interface**: Browse recipes, View details, Add to Favorites
- Deployed on **Netlify** and **Vercel** for fast and reliable hosting
- Inspected and tested thoroughly using Chrome DevTools for responsiveness and performance

## ⚙️ Tech Stack

- **React** (with Vite)
- **Bootstrap** for UI components
- **Cloudinary** for image storage
- **Postman** for API testing (during development)
- Hosted on **Netlify** and **Vercel**

## 🎯 User & Chef Interface Flow

- **Chef**
    - Separate dashboard to manage recipes
    - Add new recipes with image upload (via Cloudinary)
    - Edit & delete only their own recipes
    - View recipe statistics such as favorites and views

- **User**
    - Browse any public recipes
    - View recipe details (ingredients, steps, nutrition)
    - Add favorite recipes for easy access later

The interfaces are designed to be fully separated:
- Chefs can only manage their own data and cannot interact with user-specific functionalities like favorites
- Users cannot access chef-specific actions such as editing or deleting recipes

## 📦 Deployment

The frontend is deployed on:
- [Netlify](https://newcooks.netlify.app)
- [Vercel](https://newcooks.vercel.app)


---

This frontend works together with the NewCooks backend to deliver a seamless recipe sharing and browsing experience.
