export function getHtmlContent(): string {
     return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Tracked Comments</title>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            background: #1E1E1E; 
            color: white; 
            padding: 10px; 
            margin: 0; 
          }
          h2 { 
            font-size: 1.2em; 
            margin-bottom: 10px; 
          }
          ul { 
            list-style-type: none; 
            padding: 0; 
            margin: 0; 
          }
          li { 
            padding: 8px; 
            margin: 4px 0; 
            background: #2D2D30; 
            cursor: pointer; 
            border-radius: 4px; 
            position: relative; 
            display: flex; 
            
            justify-content: space-between; 
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis; 
          }
          li:hover { 
            background: #3C3C3C; 
          }
          li strong { 
            font-size: 0.9em; 
            overflow: hidden; 
            text-overflow: ellipsis; 
          }
          li span { 
            font-size: 0.75em; 
            color: #aaa; 
            overflow: hidden; 
            text-overflow: ellipsis; 
            max-width: 80%; 
          }
  
          /* Delete button */
          .delete-btn {
            font-family: "Material Symbols Outlined";
            font-size: 1.6em;
            color: #ff5555;
            cursor: pointer;
            padding: 4px;
          }
          .delete-btn:hover { 
            color: #ff2222; 
          }
  .cont{
 
  }
          .tooltip {
          width:100%;  
          position:absolute; 
           margin-top:5px;   
            visibility: hidden;
            direction: rtl; 
            text-align: left; RTL container */
   
            overflow: hidden;
            text-overflow: ellipsis;
          }
          li:hover .tooltip {
            visibility: visible;
            opacity: 1;
          }
  
      
          .file-path {
            direction: rtl; 
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            
            max-width: 80%; /* Limit width to allow ellipsis */
          }

         
          
         li:hover .file-path{
         display: none;
         }
        </style>
      </head>
      <body>
        <h2>Tracked Comments</h2>
        <ul id="commentList"></ul>
        <script>
          const vscode = acquireVsCodeApi();
  
          function getFileName(filePath) {
            return filePath.split(/[\\\\/]/).pop(); 
          }
  
          function truncateFilePath(filePath) {
            if (filePath.length > 40) {
              return "..." + filePath.slice(-40); 
            }
            return filePath;
          }
  
          function updateCommentList(comments) {
            const commentList = document.getElementById("commentList");
            if (!commentList) return;
            commentList.innerHTML = "";
  
            comments.forEach(({ text, line, file }) => {
              const li = document.createElement("li");
              li.innerHTML = \`
                <div class="cont">
                <strong>\${text}</strong><br>
                <span class="file-path">\${getFileName(file)} (Line \${line + 1})</span>
                  <span class="tooltip">\${file}</span>
                </div>
                <span class="delete-btn" onclick="deleteComment('\${file}', \${line})">remove</span>
              \`;
  
              li.onclick = () => vscode.postMessage({ command: "goToLine", file, line });
              commentList.appendChild(li);
            });
          }
  
          function deleteComment(file, line) {
            vscode.postMessage({ command: "deleteComment", file, line });
          }
  
          window.addEventListener("message", (event) => {
            const { command, comments } = event.data;
            if (command === "updateComments") {
              updateCommentList(comments);
            }
          });
        </script>
      </body>
      </html>`;
  }
  