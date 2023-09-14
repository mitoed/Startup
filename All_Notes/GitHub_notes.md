### Link to [all notes](/notes.md).

### Using Github
Github houses repositories in the cloud that can be accessed or updated from code editors (like Visual Studio Code) or consoles (like Git Bash or Command Line). Such interactions include:
- **cloning**: creating a copy of the repository which is linked to the original housed in Github
- **committing**: creating an update to the code, still to be sent to or from the repository on Github
- **pushing**: sending updates from a code editor to the repository on Github
- **pulling**: requesting updates from the repository on Github to your code editor
- **merging**: managing different changes to the same code from multiple sources
- **branching**: creating a new line of updates apart from the main line (like branches on a tree)
- **forking**: creating a more permanent branch from the original code; still can send to original creator to be merged with original
- **Personal Access Tokens**: unique passwords used for committing, merging, branching, etc. your repository

The highly repetitive process used as one makes changes to code goes as follows:
1. Pull the repository's latest changes from Github (console command: `git pull`)
1. Make changes to the code
1. Commit the changes (console command: `git commit`)
1. Push the changes to Github (console command: `get push`)