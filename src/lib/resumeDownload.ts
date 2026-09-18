import type { ExperienceItem, ProfileData, ProjectItem } from "../types/portfolio";

export function downloadResumeSheet(
  profile: ProfileData,
  projects: ProjectItem[],
  experience: ExperienceItem[]
) {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${profile.name} — Senior Android Developer Resume</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif; color: #0f172a; max-width: 820px; margin: 36px auto; padding: 0 24px; line-height: 1.5; font-size: 13.5px; }
    h1 { font-size: 24px; margin: 0 0 4px; letter-spacing: -0.02em; }
    h2 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #008744; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 22px; }
    .sub { color: #334155; font-weight: 600; margin-bottom: 6px; }
    .meta { font-family: monospace; font-size: 12px; color: #475569; margin-bottom: 14px; }
    .role { display: flex; justify-content: space-between; font-weight: 600; margin-top: 12px; }
    ul { margin: 6px 0 12px 18px; padding: 0; }
    li { margin-bottom: 4px; }
    .tag { font-family: monospace; font-size: 11px; color: #008744; }
    @media print { body { margin: 12px; } }
  </style>
</head>
<body>
  <h1>${profile.name}</h1>
  <div class="sub">${profile.title}</div>
  <div class="meta">${profile.email} · ${profile.location} · ${profile.github} · ${profile.linkedin}</div>
  <p>${profile.positioning}</p>
  <h2>Selected Production Android Systems</h2>
  ${projects
    .map(
      (p) => `<div>
    <div class="role"><span>${p.name}</span><span class="tag">${p.outcome}</span></div>
    <div>${p.problem}</div>
    <div><em>Architecture:</em> ${p.architectureHighlight}</div>
  </div>`
    )
    .join("")}
  <h2>Experience</h2>
  ${experience
    .map(
      (e) => `<div>
    <div class="role"><span>${e.role} — ${e.company}</span><span>${e.dates}</span></div>
    <ul>${e.milestones.map((m) => `<li>[${m.type.toUpperCase()}] ${m.text}</li>`).join("")}</ul>
  </div>`
    )
    .join("")}
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Moe_Kyaw_Aung_Senior_Android_Resume.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
