# Add teams to repo action

Action that adds teams with specified permissions levels to a repository

## Build

`ncc build index.js`

## GitHub App permissions

- Repository > Administration (Write), Metadata (Read)
- Organization > Members (Read)

## Example workflow

Workflow to add teams to a repo

```yaml create-repo.yaml
name: Add teams to a repo
on:
  issues:
    types:
      - opened
jobs:
  AddGroups:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      # Extract info from issue template
      - uses: stefanbuck/github-issue-parser@v3
        id: issue-parser
        with:
          template-path: .github/ISSUE_TEMPLATE/create-repo.yaml

      - name: Sync Groups
        uses: jcantosz/add-teams-to-repo-action@main
        with:
          pat: ${{ secrets.PAT }}
          # The org to create the repo in
          org: ${{ steps.issue-parser.outputs.issueparser_org }}
          # The repo name to create
          repo: ${{ steps.issue-parser.outputs.issueparser_repo }}
          admin_teams: "my admin team, some other team"
          write_teams: "my developer team, some other developer team"
```

## Parameters

| Parameter           | Description                                           | Default                                                 | Required | Note                                                                                                         |
| ------------------- | ----------------------------------------------------- | ------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| pat                 | The PAT used to authenticate.                         | `none`                                                  | `false`  |                                                                                                              |
| app_id              | The GitHub App ID used to authenticate.               | `none`                                                  | `false`  |                                                                                                              |
| app_private_key     | The GitHub App private key used to authenticate.      | `none`                                                  | `false`  |                                                                                                              |
| app_installation_id | The GitHub app installation ID used to authenticate.  | `none`                                                  | `false`  |                                                                                                              |
| api_url             | GitHub API URL.                                       | `none`                                                  | `false`  | Change this if using GitHub Enterprise Server.                                                               |
| org                 | The organization that contains teh repo and the team. | `none`                                                  | `true`   |                                                                                                              |
| repo                | The name of the repo to add teams to.                 | `none`                                                  | `true`   |                                                                                                              |
| admin_teams         | Input teams to be added with admin permissions.       | `Repo created with action jcantosz/create-repo-action.` | `false`  | Expects a string formatted like this: `<GitHub_Team_1_Name>[:<Entra_Group_2_Name>],<GGitHub_Team_2_Name>...` |
| maintain_teams      | Input teams to be added with maintain permissions.    | `private`                                               | `false`  | Expects a string formatted like this: `<GitHub_Team_1_Name>[:<Entra_Group_2_Name>],<GGitHub_Team_2_Name>...` |
| write_teams         | Input teams to be added with write permissions.       | `none`                                                  | `false`  | Expects a string formatted like this: `<GitHub_Team_1_Name>[:<Entra_Group_2_Name>],<GGitHub_Team_2_Name>...` |
| triage_teams        | Input teams to be added with triage permissions.      | `none`                                                  | `false`  | Expects a string formatted like this: `<GitHub_Team_1_Name>[:<Entra_Group_2_Name>],<GGitHub_Team_2_Name>...` |
| read_teams          | Input teams to be added with read permissions.        | `none`                                                  | `false`  | Expects a string formatted like this: `<GitHub_Team_1_Name>[:<Entra_Group_2_Name>],<GGitHub_Team_2_Name>...` |
