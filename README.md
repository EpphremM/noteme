# VS Code Build Tracker Extension

This extension helps track builds, bugs, and errors in your VS Code projects. It also provides bug reminders for efficient debugging.

## Features
- Track build errors and warnings
- Display bug reminders in the sidebar
- Automatically log failed builds

## 📦 Installation  
### From VS Code Marketplace  
1. Open **Extensions** (`Ctrl+Shift+X`).  
2. Search for **"Dev Notes"**.  
3. Click **Install** and restart VS Code if needed.  
Enable the extension from the Extensions panel.

## Usage
- **Write Comments:**  
  - To track a TODO or FIXME, simply add comments in your code like this:  
    ```js
    //~ TODO: Add error handling for API calls
    //~ FIXME: Fix the login issue after refresh
    ```

- **Track Comments Automatically:**  
  - The extension will automatically detect and track these comments in your project files.

- **View and Manage Comments in Sidebar:**  
  - Open the **Sidebar Panel** to view a list of all tracked comments.
  - Click on any comment to be taken directly to the exact location in your code where the comment is located.
  
- **Delete or Mark as Done:**  
  - In the sidebar, you can delete or mark comments as resolved when you've completed the task.


## Requirements
- VS Code v1.90.0 or later

## Release Notes
### 1.0.0
- Initial release with bug tracking and build monitoring.

---
Developed by Ephrem.
