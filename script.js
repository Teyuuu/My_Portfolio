// Particles background
function createParticles() {
  const container = document.getElementById('bgAnimation');
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 8 + 's';
    container.appendChild(p);
  }
}

// Mobile Menu
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('active');
});

// Smooth scrolling + close mobile menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
    document.getElementById('navLinks').classList.remove('active');
  });
});

// Carousel & Pagination
const projectsPerPage = 6;
const projectCards = document.querySelectorAll('.project-card');
const totalPages = Math.ceil(projectCards.length / projectsPerPage);
const paginationContainer = document.getElementById('pagination');

// Initialize each carousel
const allCarouselCards = document.querySelectorAll('.project-card, .cert-card');
allCarouselCards.forEach(card => {
  const imagesStr = card.getAttribute('data-images') || '';
  const images = imagesStr.split(',').map(s => s.trim()).filter(s => s);
  if (images.length === 0) return;

  const carousel = card.querySelector('.carousel-images');
  const dotsContainer = card.querySelector('.carousel-dots');
  if (!carousel) return; // Skip if no carousel container found in the card

  let currentIndex = 0;

  // Create images
  images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Screenshot ${i + 1}`;
    carousel.appendChild(img);

    // Dots
    if (dotsContainer) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  });

  // Navigation buttons
  const prevBtn = card.querySelector('.carousel-prev');
  const nextBtn = card.querySelector('.carousel-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateCarousel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateCarousel();
    });
  }

  function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    if (dotsContainer) {
      card.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  // Hide nav if only one image
  if (images.length <= 1) {
    card.querySelectorAll('.carousel-nav, .carousel-dots').forEach(el => el.style.display = 'none');
  }
});

// Pagination logic
function showPage(page) {
  projectCards.forEach((card, index) => {
    const start = (page - 1) * projectsPerPage;
    const end = page * projectsPerPage;
    card.classList.toggle('visible', index >= start && index < end);
  });

  document.querySelectorAll('.page-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i + 1 === page);
  });
}

// Create pagination buttons
for (let i = 1; i <= totalPages; i++) {
  const btn = document.createElement('button');
  btn.classList.add('page-btn');
  btn.textContent = i;
  if (i === 1) btn.classList.add('active');
  btn.addEventListener('click', () => {
    showPage(i);
    window.scrollTo({ top: document.getElementById('projects').offsetTop - 100, behavior: 'smooth' });
  });
  paginationContainer.appendChild(btn);
}

// Initial page
showPage(1);

// Start particles
createParticles();

// ============ MODAL FUNCTIONALITY ============
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('fullImage');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const modalDescription = document.getElementById('modalDescription');
const modalTechStack = document.getElementById('modalTechStack');
const modalLinks = document.getElementById('modalLinks');
const closeBtn = document.querySelector('.modal-close');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

let currentModalImages = [];
let currentModalIndex = 0;

// Function to open modal
function openModal(data) {
  modal.classList.add('active');
  if (data.minimal) {
    modal.classList.add('modal-minimal');
  } else {
    modal.classList.remove('modal-minimal');
  }

  modalImg.src = data.imgSrc;
  modalTitle.innerText = data.title;
  modalSubtitle.innerText = data.subtitle;
  modalDescription.innerText = data.description || '';

  // Handle Tech Stack
  modalTechStack.innerHTML = '';
  if (data.tech && data.tech.length > 0) {
    data.tech.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.innerText = t;
      modalTechStack.appendChild(span);
    });
  }

  // Handle Links
  modalLinks.innerHTML = '';
  if (data.links && data.links.length > 0) {
    data.links.forEach(l => {
      const a = document.createElement('a');
      a.href = l.url;
      a.target = '_blank';
      a.innerHTML = l.html;
      modalLinks.appendChild(a);
    });
  }

  document.body.style.overflow = 'hidden'; // Prevent scrolling

  currentModalImages = data.images || [data.imgSrc];
  currentModalIndex = data.index || 0;

  // Show/hide nav buttons
  if (currentModalImages.length > 1) {
    modalPrev.style.display = 'flex';
    modalNext.style.display = 'flex';
  } else {
    modalPrev.style.display = 'none';
    modalNext.style.display = 'none';
  }
}

function updateModalImage() {
  modalImg.src = currentModalImages[currentModalIndex];
}

modalPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  currentModalIndex = (currentModalIndex - 1 + currentModalImages.length) % currentModalImages.length;
  updateModalImage();
});

modalNext.addEventListener('click', (e) => {
  e.stopPropagation();
  currentModalIndex = (currentModalIndex + 1) % currentModalImages.length;
  updateModalImage();
});

// Add click listeners to all project and certificate images
document.addEventListener('click', (e) => {
  const card = e.target.closest('.project-card, .cert-card');
  if (card && e.target.tagName === 'IMG') {
    const isProject = card.classList.contains('project-card');

    // Extract info
    const title = card.querySelector(isProject ? '.project-title' : 'h3').innerText;
    const subtitle = card.querySelector(isProject ? '.project-subtitle' : '.cert-issuer')?.innerText || '';
    const description = isProject ? card.querySelector('.project-description')?.innerText : '';

    // Tech Stack
    const tech = [];
    card.querySelectorAll('.tech-stack .tech-tag').forEach(tag => tech.push(tag.innerText));

    // Links
    const links = [];
    card.querySelectorAll('.project-links a').forEach(link => {
      links.push({ url: link.href, html: link.innerHTML });
    });

    // Images
    const imagesStr = card.getAttribute('data-images') || '';
    let images = [];
    if (imagesStr) {
      images = imagesStr.split(',').map(s => s.trim()).filter(s => s);
    } else {
      images = [e.target.src];
    }
    const index = images.indexOf(e.target.getAttribute('src')) === -1 ? 0 : images.indexOf(e.target.getAttribute('src'));

    openModal({
      imgSrc: e.target.src,
      title,
      subtitle,
      description,
      tech,
      links,
      images,
      index,
      minimal: !isProject
    });
  }
});

// Close modal logic
if (closeBtn) {
  closeBtn.onclick = function () {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }
}

// Close when clicking outside the card
modal.onclick = function (e) {
  if (e.target === modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  } else if (modal.classList.contains('active')) {
    if (e.key === 'ArrowLeft') modalPrev.click();
    if (e.key === 'ArrowRight') modalNext.click();
  }
});

// ============ CHATBOT FUNCTIONALITY ============
const chatButton = document.getElementById('chatButton');
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const quickReplies = document.getElementById('quickReplies');

// Set initial time
document.getElementById('initialTime').textContent = getCurrentTime();

// Toggle chat
chatButton.addEventListener('click', () => {
  chatButton.classList.toggle('active');
  chatContainer.classList.toggle('active');
  if (chatContainer.classList.contains('active')) {
    userInput.focus();
  }
});

// Send message
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Quick replies
quickReplies.addEventListener('click', (e) => {
  if (e.target.classList.contains('quick-reply-btn')) {
    const reply = e.target.getAttribute('data-reply');
    userInput.value = e.target.textContent;
    sendMessage();
  }
});

function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  userInput.value = '';

  setTimeout(() => {
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      const response = getResponse(message.toLowerCase());
      addMessage(response, 'bot');
    }, 1000);
  }, 300);
}

function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

  const content = document.createElement('div');
  content.className = 'message-content';
  content.innerHTML = `
        <p>${text}</p>
        <div class="message-time">${getCurrentTime()}</div>
      `;

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  const typing = document.createElement('div');
  typing.className = 'message bot';
  typing.id = 'typing';
  typing.innerHTML = `
        <div class="message-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      `;
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
  const typing = document.getElementById('typing');
  if (typing) typing.remove();
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function getResponse(message) {
  // Knowledge base
  const responses = {
    projects: "Timothy has built 14+ projects including:<br><br>🌐 <strong>Church Website</strong> - Full internal system linking main site with academy and college portals<br>🛒 <strong>Canvas & Cotton</strong> - Complete e-commerce platform with real-time dashboard<br>📱 <strong>CAMTS POS</strong> - Point-of-sale system with inventory management<br>🔧 <strong>Smart Aquaponics</strong> - IoT-based automation system (Thesis project)<br><br>Which project would you like to know more about?",

    skills: "Timothy's tech stack includes:<br><br><strong>Frontend:</strong> HTML5, CSS3, JavaScript, TypeScript, Bootstrap<br><strong>Backend:</strong> Python (Flask), PHP (Laravel), MySQL, Supabase<br><strong>DevOps:</strong> Server Setup, Git, GitHub<br><strong>IoT:</strong> Arduino, NodeMCU, Firebase<br><strong>Design:</strong> Canva, CapCut, Adobe Express<br><br>He's a full-stack developer with IoT expertise!",

    contact: "You can reach Timothy through:<br><br>📧 <strong>Email:</strong> terezavilla70@gmail.com<br>💼 <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/timothy-villa-b06450280/' target='_blank' style='color: #3282b8;'>timothy-villa</a><br>💻 <strong>GitHub:</strong> <a href='https://github.com/Teyuuu' target='_blank' style='color: #3282b8;'>Teyuuu</a><br><br>Feel free to connect with him!",

    experience: "Timothy is a Computer Science graduate with hands-on experience in:<br><br>✅ Full-stack web development<br>✅ E-commerce platforms<br>✅ Church management systems<br>✅ IoT & automation<br>✅ Database design & optimization<br>✅ UI/UX design<br><br>He's passionate about building real-world solutions that make an impact!",

    education: "Timothy holds a <strong>Bachelor's degree in Computer Science</strong>. During his studies, he developed a Smart Aquaponics System as his thesis project, combining IoT, automation, and web development skills.",

    about: "Timothy Villa is a passionate Computer Science graduate who specializes in full-stack development, IoT systems, and automation. He's built 14+ projects ranging from church management systems to e-commerce platforms. When he's not coding, he enjoys creating multimedia content and designing brand identities!",

    resume: "You can download Timothy's full resume here: <a href='VILLA-CV.pdf' target='_blank' style='color: #3282b8; font-weight: 600;'>Download Resume (PDF)</a><br><br>It includes detailed information about his experience, education, and all projects!"
  };

  // Keyword matching
  if (message.includes('project')) return responses.projects;
  if (message.includes('skill') || message.includes('tech')) return responses.skills;
  if (message.includes('contact') || message.includes('email') || message.includes('reach')) return responses.contact;
  if (message.includes('experience') || message.includes('work')) return responses.experience;
  if (message.includes('education') || message.includes('degree') || message.includes('study')) return responses.education;
  if (message.includes('about') || message.includes('who')) return responses.about;
  if (message.includes('resume') || message.includes('cv')) return responses.resume;
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! 👋 I'm here to help you learn about Timothy's work. You can ask me about his projects, skills, experience, or contact information!";
  }
  if (message.includes('thank')) {
    return "You're welcome! 😊 Feel free to ask if you have any other questions about Timothy!";
  }

  // Default response
  return "I can help you with:<br><br>• Timothy's projects<br>• Technical skills<br>• Contact information<br>• Work experience<br>• Education background<br>• Resume download<br><br>What would you like to know?";
}
