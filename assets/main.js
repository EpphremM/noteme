(function () {
    const vscode = acquireVsCodeApi();
  
    window.addEventListener("message", (event) => {
      const { command, comments } = event.data;
      if (command === "updateComments") {
        updateCommentList(comments);
      }
    });
  
    function updateCommentList(comments) {
      const commentList = document.getElementById("commentList");
      commentList.innerHTML = "";
  
      comments.forEach((comment, index) => {
        const li = document.createElement("li");
        li.textContent = comment;
        li.style.cursor = "pointer";
        li.onclick = () => vscode.postMessage({ command: "goToComment", index });
        commentList.appendChild(li);
      });
    }
  })();
  