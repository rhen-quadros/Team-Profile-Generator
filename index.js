const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

const teamMembers = [];

function promptManager() {
  return inquirer.prompt([
    {
      type: "input",
      message: "Welcome, please enter your name:",
      name: "mgrName",
    },
    {
      type: "input",
      message: "Enter employee ID:",
      name: "mgrID",
    },
    {
      type: "input",
      message: "Enter email:",
      name: "mgrEmail",
    },
    {
      type: "input",
      message: "Enter office number:",
      name: "mgrOffice",
    },
  ]);
}

function promptEngineer() {
  return inquirer.prompt([
    {
      type: "input",
      message: "Enter Engineer's name:",
      name: "engName",
    },
    {
      type: "input",
      message: "Enter employee ID:",
      name: "engID",
    },
    {
      type: "input",
      message: "Enter email:",
      name: "engEmail",
    },
    {
      type: "input",
      message: "Enter Github Username:",
      name: "engGit",
    },
  ]);
}

function promptIntern() {
  return inquirer.prompt([
    {
      type: "input",
      message: "Enter Intern's name:",
      name: "internName",
    },
    {
      type: "input",
      message: "Enter employee ID:",
      name: "internID",
    },
    {
      type: "input",
      message: "Enter email address:",
      name: "internEmail",
    },
    {
      type: "input",
      message: "Enter school:",
      name: "internSchool",
    },
  ]);
}

function promptNextRole() {
  return inquirer.prompt([
    {
      type: "list",
      message: "Would you like to add another role:",
      name: "nextRole",
      choices: ["Yes", "No"],
    },
  ]);
}

function init() {
  promptManager()
    .then((managerResponse) => {
      const manager = new Manager(
        managerResponse.mgrName,
        managerResponse.mgrID,
        managerResponse.mgrEmail,
        managerResponse.mgrOffice
      );
      teamMembers.push(manager);

      let addAnotherRole = true;
      function promptNext() {
        promptNextRole().then((nextRoleResponse) => {
          if (nextRoleResponse.nextRole === "Yes") {
            inquirer
              .prompt({
                type: "list",
                message: "Choose a team role:",
                name: "roleType",
                choices: ["Engineer", "Intern"],
              })
              .then((roleTypeResponse) => {
                if (roleTypeResponse.roleType === "Engineer") {
                  promptEngineer().then((engineerResponse) => {
                    const engineer = new Engineer(
                      engineerResponse.engName,
                      engineerResponse.engID,
                      engineerResponse.engEmail,
                      engineerResponse.engGit
                    );
                    teamMembers.push(engineer);
                    promptNext();
                  });
                } else if (roleTypeResponse.roleType === "Intern") {
                  promptIntern().then((internResponse) => {
                    const intern = new Intern(
                      internResponse.internName,
                      internResponse.internID,
                      internResponse.internEmail,
                      internResponse.internSchool
                    );
                    teamMembers.push(intern);
                    promptNext();
                  });
                }
              });
          } else {
            addAnotherRole = false;
            const htmlContent = render(teamMembers);

            fs.writeFileSync(outputPath, htmlContent);

            console.log(
              `Team HTML file generated successfully at ${outputPath}`
            );
          }
        });
      }

      promptNext();
    })
    .catch((error) => {
      console.error("An error occurred:", error.message || error);
    });
}

init();
