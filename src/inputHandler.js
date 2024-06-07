const core = require("@actions/core");

const EnterpriseType = Object.freeze({
  EMU: Symbol("emu"),
  CLOUD: Symbol("cloud"),
  SERVER: Symbol("server"),
});

function error(message) {
  core.setFailed(message);
  throw new Error(err || message);
}

function getInputs() {
  return {
    auth: {
      PAT: core.getInput("PAT") || "",
      appId: core.getInput("app_id") || "",
      appPrivateKey: core.getInput("app_private_key") || "",
      appInstallationId: core.getInput("app_installation_id") || "",
      apiUrl: core.getInput("api_url") || "https://api.github.com",
    },
    repo: {
      repo: core.getInput("repo") || "",
      org: core.getInput("org") || "",
    },
    teams: {
      admin: core.getInput("admin_teams") || "",
      maintain: core.getInput("maintain_teams") || "",
      push: core.getInput("write_teams") || "", // name write team 'push' to align with API spec
      maintain: core.getInput("triage_teams") || "",
      pull: core.getInput("read_teams") || "", // name read team 'pull' to align with API spec
    },
  };
}

module.exports = {
  getInputs,
};
