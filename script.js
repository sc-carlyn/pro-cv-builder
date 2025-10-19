// Elements
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const skills = document.getElementById("skills");

const cvName = document.getElementById("cvName");
const cvContact = document.getElementById("cvContact");
const cvSkills = document.getElementById("cvSkills");
const cvEducationTimeline = document.getElementById("cvEducationTimeline");
const cvExperienceTimeline = document.getElementById("cvExperienceTimeline");

const langSelect = document.getElementById("language");
const themeSelect = document.getElementById("theme");
const downloadBtn = document.getElementById("downloadBtn");
const formPanel = document.getElementById("formPanel");

// Language dictionary
const dictionary = {
  tr: {
    header: "📄 CV Oluşturucu",
    subHeader: "Bilgilerinizi girin, CV’nizi anında görün!",
    personal: "Kişisel Bilgiler",
    education: "Eğitim",
    experience: "İş Deneyimi",
    skills: "Yetenekler",
    download: "CV’yi PDF İndir",
    placeholders: {
      fullName: "Ad Soyad",
      email: "E-posta",
      phone: "Telefon",
      skills: "JavaScript, HTML, CSS",
      edu: "Üniversite / Bölüm / Yıl",
      exp: "Şirket / Pozisyon / Yıl"
    }
  },
  en: {
    header: "📄 CV Builder",
    subHeader: "Enter your info and preview your CV instantly!",
    personal: "Personal Information",
    education: "Education",
    experience: "Work Experience",
    skills: "Skills",
    download: "Download CV as PDF",
    placeholders: {
      fullName: "Full Name",
      email: "Email",
      phone: "Phone",
      skills: "JavaScript, HTML, CSS",
      edu: "University / Degree / Year",
      exp: "Company / Position / Year"
    }
  }
};

// Apply language
langSelect.addEventListener("change", () => {
  const lang = langSelect.value;
  const dict = dictionary[lang];

  document.getElementById("mainHeader").textContent = dict.header;
  document.getElementById("subHeader").textContent = dict.subHeader;

  document.querySelector('div[data-section="personal"] h2').textContent = dict.personal;
  document.querySelector('div[data-section="education"] h2').textContent = dict.education;
  document.querySelector('div[data-section="experience"] h2').textContent = dict.experience;
  document.querySelector('div[data-section="skills"] h2').textContent = dict.skills;

  fullName.placeholder = dict.placeholders.fullName;
  email.placeholder = dict.placeholders.email;
  phone.placeholder = dict.placeholders.phone;
  skills.placeholder = dict.placeholders.skills;

  document.querySelector(".eduInstitution").placeholder = dict.placeholders.edu;
  document.querySelector(".expCompany").placeholder = dict.placeholders.exp;

  downloadBtn.textContent = dict.download;
});

// Theme switching
themeSelect.addEventListener("change", () => {
  const t = themes[themeSelect.value];
  document.body.style.backgroundColor = t.body;
  document.querySelectorAll(".form-panel, .preview-panel").forEach(p => p.style.backgroundColor = t.panel);
  document.getElementById("mainHeader").style.color = t.header;
  document.getElementById("subHeader").style.color = t.subHeader;
  document.querySelectorAll(".form-panel h2").forEach(h => h.style.color = t.h2);
  document.querySelectorAll(".preview-panel h2").forEach(h => h.style.color = t.h2);
  document.querySelectorAll(".cv-preview h3").forEach(h => h.style.color = t.h3);
  downloadBtn.style.backgroundColor = t.button;
  downloadBtn.onmouseover = () => downloadBtn.style.backgroundColor = t.buttonHover;
  downloadBtn.onmouseout = () => downloadBtn.style.backgroundColor = t.button;
});

// Drag & Drop
const draggables = document.querySelectorAll(".draggable-section");
draggables.forEach(draggable => {
  draggable.setAttribute("draggable", true);
  draggable.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", draggable.dataset.section);
    draggable.classList.add("dragging");
  });
  draggable.addEventListener("dragend", () => draggable.classList.remove("dragging"));
});

formPanel.addEventListener("dragover", e => {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  const afterElement = getDragAfterElement(formPanel, e.clientY);
  if(afterElement==null) formPanel.appendChild(dragging);
  else formPanel.insertBefore(dragging, afterElement);
});

function getDragAfterElement(container, y){
  const draggableElements = [...container.querySelectorAll(".draggable-section:not(.dragging)")];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height/2;
    if(offset < 0 && offset > closest.offset) return { offset: offset, element: child };
    else return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Live preview
fullName.addEventListener("input", () => cvName.textContent = fullName.value || dictionary[langSelect.value].placeholders.fullName);
email.addEventListener("input", updateContact);
phone.addEventListener("input", updateContact);

function updateContact(){
  let parts = [];
  if(email.value) parts.push(email.value);
  if(phone.value) parts.push(phone.value);
  cvContact.textContent = parts.join(" | ") || dictionary[langSelect.value].placeholders.email + " | " + dictionary[langSelect.value].placeholders.phone;
}

skills.addEventListener("input", () => {
  cvSkills.innerHTML = "";
  if(skills.value){
    skills.value.split(',').forEach(skill=>{
      const bar = document.createElement("div");
      bar.className = "skill-bar";
      bar.textContent = skill.trim();
      cvSkills.appendChild(bar);
    });
  }
});

// Timeline + Logo preview
document.querySelectorAll(".eduLogo, .expLogo").forEach(input => {
  input.addEventListener("change", e => {
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = () => {
        const imgPreview = document.createElement("img");
        imgPreview.src = reader.result;
        e.target.parentElement.previewImg?.remove();
        e.target.parentElement.previewImg = imgPreview;
        e.target.parentElement.appendChild(imgPreview);

        // Timeline preview
        if(e.target.classList.contains("eduLogo")){
          const item = document.createElement("div"); item.className="timeline-item";
          item.innerHTML = `<img src="${reader.result}"/> ${e.target.previousElementSibling.value}`;
          cvEducationTimeline.appendChild(item);
        } else {
          const item = document.createElement("div"); item.className="timeline-item";
          item.innerHTML = `<img src="${reader.result}"/> ${e.target.previousElementSibling.value}`;
          cvExperienceTimeline.appendChild(item);
        }
      }
      reader.readAsDataURL(file);
    }
  });
});

// PDF download
downloadBtn.addEventListener("click", () => {
  const clone = document.getElementById("cvPreview").cloneNode(true);
  clone.querySelectorAll(".skill-bar").forEach(bar => { bar.style.color="#fff"; bar.style.backgroundColor="#6A1B9A"; });
  clone.querySelectorAll(".timeline-item img").forEach(img => img.style.height="25px");
  html2pdf().set({margin:0.5, filename:'CV.pdf', html2canvas:{scale:2, useCORS:true}, jsPDF:{unit:'in', format:'letter', orientation:'portrait'}}).from(clone).save();
});
