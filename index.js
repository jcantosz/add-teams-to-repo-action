const Auth = require("./src/auth.js");
const core = require("@actions/core");
const { getInputs } = require("./src/inputHandler.js");

function teamToArray(type, teams) {
  const groupArray = [];
  for (const team of teams.split(",")) {
    core.debug(`processing team map: ${team}`);
    const components = team.split(":");
    const idpGroup = components.length > 1 ? components.pop() : ""; // if there are multiple elements, get the last one, otherwise get nothing
    groupArray.push({
      permissions: type,
      github_team: components.join(":") || "", // Join remaining elements with ":" in case that was removed
      idp_group: idpGroup,
    });
  }
  return groupArray;
}

// Split apart each team from the input and put into array of objects
function teamsToArray(teams) {
  let teamsArr = [];
  core.debug(`Teams to array ${teams}`);

  // get all the keys
  for (const team in teams) {
    core.debug(`Parsing team ${team} (${teams[team]})`);
    if (teams[team]) {
      curr = teamToArray(team, teams[team]);
      teamsArr = teamsArr.concat(curr);
    }
  }
  return teamsArr;
}

function teamToTeamSlug(teamName) {
  // Note from docs: To create the slug, GitHub replaces special characters in the name string, changes all words to lowercase, and replaces spaces with a - separator. For example, "My TEam Näme" would become my-team-name.
  return (
    teamName
      .replace(/\W+/g, "-")
      .replace(/^\W|\W$/g, "")
      .toLowerCase() || "team"
  );
}

async function addTeamToRepo(octokit, repo, team) {
  // why are both org and owner needed? Cant add a team from one org to a repo in another
  return await await octokit.request("PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}", {
    org: repo.org,
    team_slug: team.teamSlug,
    owner: repo.org,
    repo: repo.repo,
    permission: team.permissions,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
}

async function addTeamsToRepo(octokit, repo, teams) {
  for (const team of teams) {
    core.info(`Adding team ${team.github_team} to repo`);
    team.teamSlug = teamToTeamSlug(team.github_team);
    core.debug(`Team properties: ${JSON.stringify(team)}`);
    await addTeamToRepo(octokit, repo, team);
  }
}

async function main() {
  const inputs = getInputs();
  core.debug(`inputs: ${JSON.stringify(inputs)}`);

  const auth = Auth.createOctokitInstance(inputs.auth);
  const teamsArray = teamsToArray(inputs.teams); // [{permissions: "", github_team: "", idp_group: ""}, ...]

  // Can add checks for both team and repo first but lets just let it fail
  await addTeamsToRepo(auth.octokit, inputs.repo, teamsArray);
}

// Only run main if called directly
if (require.main === module) {
  main();
}
