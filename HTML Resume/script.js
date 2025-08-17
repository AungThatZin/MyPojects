function openTab(event, tabName) {
  // Get all tab content elements
  const tabContents = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove("active");
  }

  // Get all tab elements
  const tabs = document.getElementsByClassName("tab");
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }

  // Show the current tab and add active class
  document.getElementById(tabName).classList.add("active");
  event.currentTarget.classList.add("active");

  // Update the tabs container class for the sliding effect
  const tabsContainer = document.querySelector(".tabs");
  if (tabName === 'resources') {
    tabsContainer.classList.add("tab2-active");
  } else {
    tabsContainer.classList.remove("tab2-active");
  }



}
    
    // Add animation to cards when page loads
    window.onload = function() {
      const cards = document.querySelectorAll('.tool-card, .project-card');
      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease ' + (index * 0.1) + 's';
        
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 200);
      });
    };
    // Previous JavaScript remains the same

window.onload = function () {
  const progressFill = document.getElementById('work-progress');
  const progressText = document.querySelector('.progress-percent.project-progress');

  // Set your custom progress contribution for each section
  const progressSessions = {
    started: true,           // +25%
    releaseDate: false,       // +25%
    teamSize: false,         // +0%
    version: false            // +25%
  };

  // Calculate targetWidth based on which are "true"
  const totalSections = Object.keys(progressSessions).length;
  const perSection = 100 / totalSections;
  const targetWidth = Object.values(progressSessions).filter(Boolean).length * perSection;

  if (progressFill && progressText) {
    let width = 0;

    const interval = setInterval(() => {
      if (width >= targetWidth) {
        clearInterval(interval);
      } else {
        width++;
        progressFill.style.width = width + '%';
        progressText.textContent = width + '%';
      }
    }, 20);
  }
};

window.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split('/').pop(); // e.g., "index.html"
    const navItems = document.querySelectorAll("#nav-menu li");

    navItems.forEach(li => {
      const link = li.querySelector("a.nav-link");
      if (link) {
        const href = link.getAttribute("href");
        if (href === currentPage) {
          li.classList.add("active"); // Add class to <li>, not <a>
        }
      }
    });
  });
    // recent active js
    
  const modal = document.getElementById("journal-modal");
const modalTitle = document.getElementById("modal-title");
const modalDate = document.getElementById("modal-date");
const modalStatus = document.getElementById("modal-status");
const modalBody = document.getElementById("modal-body");
const modalTechTags = document.getElementById("modal-tech-tags");
const closeBtn = document.querySelector(".close-modal");
const readMoreBtns = document.querySelectorAll(".read-more-btn");

// Journal data
const journals = {
  "python-journey": {
    title: "My Python Learning Journey",
    date: "2020 (4 months)",
    status: "Completed",
    body: "<p>This was my first exposure to programming. I started with basic Python syntax and gradually moved to more complex concepts like functions, classes, and file handling. The most challenging part was understanding object-oriented programming, but after building several small projects, it finally clicked.</p><p>Key achievements:</p><ul><li>Built a simple calculator</li><li>Created a file organizer script</li><li>Developed a basic text-based game</li></ul>",
    tags: ["Python", "Programming Fundamentals", "OOP"]
  },
  "java-journey": {
    title: "Java Fundamentals at Ace Aspiration",
    date: "2021 (1 month)",
    status: "Completed",
    body: "<p>At Ace Aspiration, I learned Java from the ground up. The structured environment helped me understand strong typing and the Java ecosystem. We focused on core concepts like variables, loops, and methods before moving to object-oriented principles.</p><p>Notable projects:</p><ul><li>Bank account management system</li><li>Student grade calculator</li></ul>",
    tags: ["Java", "OOP", "Algorithms"]
  },
  // Add other journal entries similarly
};

// Open modal
readMoreBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const journalId = btn.getAttribute("data-modal");
    const journal = journals[journalId];
    
    modalTitle.textContent = journal.title;
    modalDate.textContent = journal.date;
    modalStatus.textContent = journal.status;
    modalBody.innerHTML = journal.body;
    
    // Clear and add tech tags
    modalTechTags.innerHTML = "";
    journal.tags.forEach(tag => {
      const tagEl = document.createElement("span");
      tagEl.className = "tech-tag";
      tagEl.textContent = tag;
      modalTechTags.appendChild(tagEl);
    });
    
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  });
});

// Close modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
});

// Close when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
});
  function openJourneyModal() {
    document.getElementById('journeyModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
  
  function closeJourneyModal() {
    document.getElementById('journeyModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }
  
  // Close modal when clicking outside content
 const filesData = [
  {
    name: "Old_Portfolio_2022.zip",
    path: "Myprojects/Announcement-System-in-Telegram-main.zip",
    size: "12.5 MB",
    modified: "15 Oct 2022"
  }
];

// Simple data logging - just what you asked for
console.log("=== FILE DATA DEBUGGING ===");
filesData.forEach((file, index) => {
  console.log(`File #${index}:`);
  console.log(`- Name: ${file.name}`);
  console.log(`- Path: ${file.path}`);
  console.log(`- Size: ${file.size}`);
  console.log(`- Modified: ${file.modified}`);
  console.log("-------------------");
});

window.onload = function() {
  console.log("Checking if data is being processed...");
  
  const fileListContainer = document.getElementById('file-list') || document.querySelector('.file-list');
  
  if (!fileListContainer) {
    console.error("ERROR: Can't find file list container");
    return;
  }

  filesData.forEach((file, index) => {
    console.log(`Creating element for: ${file.name}`);
    
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
      <i class="fa fa-file-archive-o file-icon"></i>
      <div class="file-info">
        <div class="file-name">${file.name}</div>
        <div class="file-meta">${file.size} · ${file.modified}</div>
      </div>
      <a href="#" class="file-download" data-index="${index}">
        <i class="fa fa-download"></i>
      </a>
    `;
    
    fileListContainer.appendChild(fileItem);
    console.log(`Added to DOM: ${file.name}`);
  });

  // Simple download handler logging
  document.querySelectorAll('.file-download').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const index = this.getAttribute('data-index');
      const file = filesData[index];
      console.log(`Download clicked for: ${file.name}`);
      console.log(`Attempting to fetch: ${file.path}`);
      
      const a = document.createElement('a');
      a.href = file.path;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  });
};

  const themeToggle = document.querySelector('.theme-toggle');
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });



        const toggle = document.getElementById('darkModeToggle');
  const html = document.documentElement;
  
  // Check for saved user preference
  if (localStorage.getItem('theme') === 'dark') {
    html.setAttribute('data-theme', 'dark');
    toggle.checked = true;
  }
  
  // Toggle dark mode
  toggle.addEventListener('change', function() {
    if (this.checked) {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  });
