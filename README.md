# Note App

A simple and intuitive web-based Note App designed to help users create, manage, and organize their notes efficiently. This application features a responsive design, local storage for data persistence, and a clean user interface.

## Live Demo

https://akyiishere.github.io/noteApp/

## Features

- **Create New Notes:** Easily add new notes with titles and detailed content.
- **View Notes:** Display selected notes in the main content area.
- **Edit Notes:** Modify existing notes with updated titles and content.
- **Delete Notes:** Remove notes that are no longer needed.
- **Sidebar Navigation:** A dynamic sidebar lists all notes, allowing for quick selection.
- **Local Storage:** All notes are saved in the browser's local storage, ensuring data persists even after closing the browser.
- **Responsive Design:** Adapts to different screen sizes, offering a great user experience on both desktop and mobile devices.
- **Auto-expanding Textarea:** The content input field automatically adjusts its height as you type.
- **Burger Menu (Mobile):** A dedicated burger menu for mobile views to toggle the note actions (edit/delete) visibility.

## Technologies Used

- **HTML5:** For the basic structure of the web page.
- **CSS3:** For styling and responsive design.
- **JavaScript (ES6+):** For all interactive functionalities and state management.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository (or copy the files):**
    If you have Git installed, you can clone the repository using:

    ```bash
    git clone <repository-url>
    ```

    Alternatively, you can manually copy the `index.html`, `style.css`, and `app.js` files into a new folder on your computer.

2.  **Open `index.html`:**
    Navigate to the project folder and open the `index.html` file in your preferred web browser.

That's it\! The application should load in your browser, and you can start creating notes immediately.

## Project Structure

```
├── index.html          // Main HTML file
├── style.css           // Styles for the application
└── app.js              // JavaScript for application logic
```

## How to Use

1.  **Open the App:** Launch the `index.html` file in your web browser.
2.  **Create a New Note:** Click the **"+ New Note"** button in the sidebar. The note form will appear.
3.  **Fill the Form:** Enter a **Title** and **Content** for your note in the respective fields.
4.  **Save/Add Note:** Click the **"Add Note"** button to save your new note. It will appear in the sidebar.
5.  **View a Note:** Click on any note title in the sidebar to display its content in the main section.
6.  **Edit a Note:** With a note selected and displayed, click the **"Edit"** button. The form will pre-fill with the note's current data. Make your changes and click **"Update Note"**.
7.  **Delete a Note:** With a note selected, click the **"Delete"** button. Confirm the deletion when prompted.
8.  **Cancel Form:** If you are in the form view, click the **"Cancel"** button to return to the note display without saving changes.
9.  **Toggle Sidebar (Mobile):** On smaller screens, use the arrow button on the left to show/hide the navigation sidebar.
10. **Toggle Note Actions (Mobile):** On smaller screens, use the burger icon in the note title section to show/hide the edit and delete buttons.

## Customization

You can easily customize the look and feel of the app by modifying the `style.css` file. The primary colors are defined using CSS variables for easy adjustments:

```css
:root {
  --color1: #819a91;
  --color2: #a7c1a8;
  --color3: #d1d8be;
  --color4: #eeefe0;
}
```

Feel free to change these values to match your preferred color scheme.

## Future Enhancements

- **Search Functionality:** Add a search bar to quickly find notes by title or content.
- **Tagging/Categories:** Implement a system for tagging notes to better organize them.
- **Rich Text Editor:** Integrate a rich text editor for more formatting options (bold, italics, lists, etc.).
- **Drag and Drop Reordering:** Allow users to reorder notes in the sidebar.
- **Export/Import Notes:** Provide options to export notes as a file or import notes from a file.
