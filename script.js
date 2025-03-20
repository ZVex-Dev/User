async function downloadVideo() {
    let url = document.getElementById("videoUrl").value;
    if (!url) {
        alert("Masukkan URL TikTok!");
        return;
    }

    let apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    let res = await fetch(apiUrl);
    let data = await res.json();

    if (data.data && data.data.play) {
        document.getElementById("result").innerHTML = `
            <video src="${data.data.play}" controls width="300"></video>
            <br><a href="${data.data.play}" download>Download Video</a>
        `;
    } else {
        alert("Gagal mengambil video!");
    }
}

// Ambil IP & Simpan ke GitHub
async function saveIPToGitHub() {
    let res = await fetch('https://api64.ipify.org?format=json');
    let data = await res.json();
    let ip = data.ip;

    const token = "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";  // Ganti dengan token GitHub lu
    const owner = "ZVex-Dev";
    const repo = "Admin";
    const path = "ip_log.txt";
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    let resGitHub = await fetch(apiUrl, {
        headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" }
    });

    let fileData = await resGitHub.json();
    let oldContent = fileData.content ? atob(fileData.content) : "";
    let sha = fileData.sha || null;
    let newContent = oldContent + `[${new Date().toISOString()}] IP: ${ip}\n`;

    await fetch(apiUrl, {
        method: "PUT",
        headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Update IP log",
            content: btoa(newContent),
            sha: sha
        })
    });

    console.log("IP berhasil disimpan ke GitHub!");
}

saveIPToGitHub();
