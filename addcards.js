const oM = [
    {
      id: 0,
      name: "Red Bull Sales Drivers",
      description: "Micro-frontend sales-enablement platform for Red Bull North America. Built reusable React/MobX modules consumed across the RBNA web suite with strict performance and a11y budgets.",
      image: "images/projects/redbull.svg",
      tags: ["react", "typescript", "mobx", "vite", "enterprise"],
      liveview: "https://www.redbull.com/",
      alt: "Red Bull Sales Drivers Web App",
    },
    {
      id: 1,
      name: "OnlineCook",
      description: "Recipe-centric food platform — Next.js storefront, NestJS API, Prisma + Postgres, plus a Python/Prefect recipe-import pipeline. Ships as a Yarn 2 monorepo with Docker-based dev.",
      image: "images/projects/onlinecook.svg",
      tags: ["nextjs", "nestjs", "typescript", "prisma", "docker"],
      liveview: "https://onlinecook.com/",
      alt: "OnlineCook Recipe Platform",
    },
    {
      id: 2,
      name: "Rehousing",
      description: "End-to-end real-estate platform for the Toronto market. NestJS API with Prisma, Redis & Elasticsearch, paired with a typed React/Vite admin and tenant portal generated from OpenAPI.",
      image: "images/projects/rehousing.svg",
      tags: ["react", "nestjs", "typescript", "prisma", "elasticsearch"],
      liveview: "https://rehousing.ca/",
      alt: "Rehousing Real Estate Platform",
    },
    {
      id: 3,
      name: "SecureUS",
      description: "Cross-platform security suite — React Native + Expo mobile app and NestJS backend in a Turbo-powered monorepo. Designed for offline-first field workflows with end-to-end TypeScript.",
      image: "images/projects/secureus.svg",
      tags: ["reactnative", "expo", "nestjs", "typescript", "turbo"],
      liveview: "https://secureus.app/",
      alt: "SecureUS Security Mobile App",
    },
    {
      id: 4,
      name: "LaunchEmpire",
      description: "Multi-product SaaS suite (Vaultpilot · Recruitpilot · SmartTax) built on a Next.js 14 + NestJS + Prisma stack. One shared API powers three branded Next.js apps inside a Yarn-Berry monorepo.",
      image: "images/projects/launchempire.svg",
      tags: ["nextjs", "nestjs", "typescript", "prisma", "tailwind"],
      liveview: "https://launchempire.io/",
      alt: "LaunchEmpire SaaS Suite",
    },
  ];

  class lM {
    constructor() {
      he(this, "domElements", {
        renderContainer: document.getElementById("work-render-container"),
      });
      (this.experience = new ye()),
        (this.sounds = this.experience.sounds),
        (this.items = oM),
        (this.tags = aM),
        this.renderItems();
    }

    renderItems() {
      this.items.forEach((e) => {
        this.domElements.renderContainer.insertAdjacentHTML(
          "beforeend",
          `
              <div id="work-item-${e.id}" class="work-item-container column">
                  <img class="work-item-image" src="${e.image}" alt="${
            e.alt
          }" height="300" width="334"/>
                  <div class="work-item-content-container">
                      <h3>${e.name}</h3>
                      <div class="work-item-tag-container row">
                          ${this.renderTags(e.tags)}
                      </div>
                      <span>${e.description}</span>
                  </div>
                  <div class="work-item-button-container row">
                      ${this.renderButtons(e)}
                  </div>
                  ${e.bannerIcons ? this.renderBanner(e) : ""}
              </div>
              `
        ),
          this.addEventListenersToCard(e);
      });
    }

    renderBanner(e) {
      let t = "";
      return (
        (t = `
              <div class="work-banner-container row center">
                  ${e.bannerIcons.map(
                    (n) =>
                      `<img src="${n.src}" alt="${n.alt}" height="64" width="64"/>`
                  )}
                  <span>Website Of<br>The Day</span>
              </div>
          `),
        t
      );
    }

    renderButtons(e) {
      let t = "";
      if (e.liveview) {
        t = `
          <div id="work-item-orange-button-${e.id}" class="work-item-orange-button small-button center orange-hover" style="width: 100%; margin: 0;">
              Live View
          </div>`;
      } else {
        t = `
          <div id="work-item-gray-button-${e.id}" class="work-item-gray-button center" style="width: 100%; background: #a7adb8; cursor: unset;">
              Work in progress
          </div>`;
      }
      return t;
    }

    renderTags(e) {
      let t = "";
      for (let n = 0; n < e.length; n++) t += this.tags[e[n]];
      return t;
    }

    addEventListenersToCard(e) {
      const t = document.getElementById("work-item-" + e.id);
      t.addEventListener("click", () => {
        t.classList.contains("work-inactive-item-container") &&
          document
            .getElementById("work-item-0")
            .classList.contains("work-item-container-transition") &&
          ((this.experience.ui.work.cards.currentItemIndex = -e.id + 4),
          this.experience.ui.work.cards.updatePositions(),
          this.sounds.play("buttonClick"));
      });

      if (e.liveview) {
        document
          .getElementById("work-item-orange-button-" + e.id)
          .addEventListener("click", () => {
            window.open(e.liveview, "_blank").focus();
          });
      }
    }
  }
