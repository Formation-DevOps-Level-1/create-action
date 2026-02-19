const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const nameToGreet = core.getInput('name');
        console.log(`Hello ${nameToGreet}!`);
        github.output('fullName', `Hello ${nameToGreet}!`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();