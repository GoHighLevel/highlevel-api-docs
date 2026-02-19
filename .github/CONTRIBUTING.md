# Contributing to GoHighLevel API V2 Docs

Thank you for your interest in contributing! We welcome suggestions, improvements, and fixes that help enhance the GoHighLevel developer experience.

This guide outlines how you can get started and what we expect from contributors.

---

## 📁 Repository structure and where to contribute

| Path | Contents | Should you open a PR? |
|------|----------|------------------------|
| **`docs/`** | Static Markdown documentation (guides, OAuth, webhooks, etc.) | **Yes.** PRs that add or edit files in `docs/` are welcome and will be reviewed. |
| **`apps/`** | OpenAPI/JSON spec files (one per product area) | **No.** These files are **auto-generated** in our backend and synced here when changes are merged to master. Do **not** open PRs to change them—they will be overwritten. |
| **`common/`** | Shared JSON schemas | **No.** Same as `apps/`—auto-generated and synced. Do not submit PRs that modify these files. |

- **Bugs or missing/incorrect API fields:** Open an **issue** (use our bug report templates). We fix these in the backend; the updated JSON will be synced to this repo.
- **New feature requests or documentation ideas:** Open an **issue**. For doc changes that you can write yourself, open a PR that only touches the **`docs/`** folder.

This repo mixes **manually maintained** content (e.g. `docs/`) with **generated** content (`apps/`, `common/`) produced and synced from our internal systems. If your contribution depends on or relates to changes in that generated content—for example, new or corrected API fields, endpoints, or schemas—please say so in the issue or pull request. We will usually need to update our backend; calling it out helps us prioritize and align before we can accept or fully apply your contribution.

---

## 🚀 How to Contribute

1. **Fork the Repository**  
   Click the **Fork** button at the top right to create your own copy of this repository.

2. **Clone Your Fork Locally**  
    Clone your fork using the following commands:
    
    ```bash
    git clone https://github.com/YOUR-USERNAME/api-v2-docs.git
    cd api-v2-docs
    ```

3. **Create a New Branch**  
    Create a feature branch to work on:
    
    ```bash
    git checkout -b feature/your-feature-name
    ```

4. **Make Your Changes**  
    Edit only files under **`docs/`** (or other non–auto-generated content). Use clear, consistent Markdown and follow the structure of existing files. Do not modify JSON in `apps/` or `common/`.

5. **Commit Your Changes**  
    Commit your changes with a descriptive message:

    ```bash
    git commit -m "Update: Brief description of your changes"
    ```

6. **Push to Your Fork**  
    Push the branch to your GitHub fork:

    ```bash
    git push origin feature/your-feature-name
    ```

7. **Open a Pull Request**  
    - Go to the original repo: [GoHighLevel/api-v2-docs](https://github.com/GoHighLevel/api-v2-docs)
    - Click **“Compare & pull request”**
    - Describe your changes clearly and concisely
    - **Ensure your PR only changes files in `docs/`** (or other approved areas). PRs that modify `apps/` or `common/` will not be accepted.
    - Submit the pull request for review

---

## ✍️ Documentation Guidelines

When contributing new documentation or improving existing content, please:

- Use clear, concise language
- Format your contributions in Markdown
- Match the tone and structure of the existing documentation
- When documenting API endpoints, include:
  - Endpoint path and HTTP method
  - Authentication requirements
  - Request parameters and example body
  - Example responses
  - Common error codes and descriptions

---

## ✅ Before You Submit

Please make sure that:

- [ ] Your changes follow the existing file structure and style  
- [ ] You’ve tested that Markdown renders correctly  
- [ ] You’ve proofread for grammar, clarity, and formatting  
- [ ] You’ve linked any related GitHub issues (if applicable)  

---

## 🧠 Questions or Support

If you’re not sure how or where to contribute:

- Open a [GitHub issue](https://github.com/GoHighLevel/api-v2-docs/issues)
- Ask in the [HighLevel Community](https://www.facebook.com/groups/gohighlevel)

We’re excited to collaborate with you—thanks for helping improve our documentation!
