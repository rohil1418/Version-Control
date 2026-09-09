const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init.js");
const { addRepo } = require("./controllers/add.js");
const { commitRepo } = require("./controllers/commit.js");
const { pullRepo } = require("./controllers/pull.js");
const { pushRepo } = require("./controllers/push.js");
const { revertRepo } = require("./controllers/revert.js");

yargs(hideBin(process.argv))
    .command("init", "Initialised a new repository", {}, initRepo)
    .command("add <file>",
        "Add a file to the repository",
        (yargs) => {
            yargs.positional("file", {
                describe: " File to add to the staging area",
                type: "string",
            });
        },
        (argv) => {
            addRepo(argv.file);
        }
    )
    .command("commit <message>",
        "commit the staged files",
        (yargs) => {
            yargs.positional("message", {
                describe: " commit message",
                type: "string",
            });
        }, (argv) => {
            commitRepo(argv.message);
        })
    .command("pull", "pull commits from S3", {}, pullRepo)
    .command("push", "push commits from S3", {}, pushRepo)
    .command("revert<commitID>",
        "Revert to a specific commit",
        (yargs) => {
            yargs.positional("commitID", {
                describe: " commit ID to revert to",
                type: "string",
            });
        }, revertRepo)
    .demandCommand(1, " you need at least one command")
    .help().argv;