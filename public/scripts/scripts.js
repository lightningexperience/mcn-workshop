window.onload = function() {
  SalesforceInteractions.setLoggingLevel('debug');

  // Register Content Zone Handlers BEFORE init()
  SalesforceInteractions.Personalization.Config.ContentZoneHandler.set(
    "home_hero_banner",
    {
      label: "Home Hero Banner",
      path: ".left-column img",
      onReady: (content) => {
        const target = document.querySelector(".left-column img");
        if (target) target.outerHTML = content;
      },
      onRevert: () => {
        location.reload();
      }
    }
  );

  SalesforceInteractions.Personalization.Config.ContentZoneHandler.set(
    "product_recs_section",
    {
      label: "Product Recommendations",
      path: ".product-list",
      onReady: (content) => {
        const target = document.querySelector(".product-list");
        if (!target) return;

        // NEW: Handle the Recommender JSON array without breaking the layout
        if (Array.isArray(content) && content.length > 0) {
          const product = content[0]; // Grab just the first recommended product
          const name = product.attributes?.["Product Name"] || product.attributes?.Product_Name || "Recommended Product";
          const imgUrl = product.attributes?.["Image URL"] || product.attributes?.Image_URL || "";
          
          const firstChild = target.querySelector(".product:first-child");
          if (firstChild) {
            firstChild.innerHTML = `<img src="${imgUrl}" alt="${name}" style="max-width: 100%; height: auto;" /><p>${name}</p>`;
          }
        } 
        // ORIGINAL: Run your old demo logic for HTML strings
        else {
          target.innerHTML = content;
        }
      },
      onRevert: () => {
        location.reload();
      }
    }
  );

  // WPM config BEFORE init()
  SalesforceInteractions.Personalization.Config.initialize({
    personalizationExperienceConfigs: []
  });

  SalesforceInteractions.init({
    consents: [{
        provider: "ConsentProvider",
        purpose: SalesforceInteractions.ConsentPurpose.Tracking,
        status: SalesforceInteractions.ConsentStatus.OptIn
    }],
    personalization: {
      dataspace: "default" 
    }
  }).then(() => {
    const config = {
      global: {
        contentZones: [
          { name: "home_hero_banner", selector: ".left-column img" },
          { name: "product_recs_section", selector: ".product-list .product:first-child" }
        ]
      },
      pageTypes: [
        {
          name: "product_detail",
          isMatch: () => window.location.pathname.includes("product"),
          interaction: {
            name: "View Catalog Object", 
            catalogObject: {
              type: "Product",
              get id() { return getProductId(); }, 
              interactionName: "View",
              attributes: {
                get name() { return getProductTitle(); },
                get description() { return getProductDescription(); }
              }
            }
          }
        },
        {
          name: "homepage",
          isMatch: () => window.location.pathname.endsWith("index.html") || window.location.pathname === "/",
          interaction: { name: "Homepage View" }
        }
      ]
    };

    SalesforceInteractions.initSitemap(config);
  });
};

function getProductId() {
  const path = window.location.pathname;
  const fileName = path.split("/").pop(); 
  return fileName.replace("product", "").replace(".html", "") || "1"; 
}
function getProductTitle() { return document.querySelector(".product-description h1")?.innerText || ""; }
function getProductDescription() { return document.querySelector(".product-description p")?.innerText || ""; }

// Function to show the login form
function displayAuthForm() {
    document.getElementById("loginform").style.visibility = "visible";
}

// Function to hide the login form
function hideAuthForm() {
    document.getElementById("loginform").style.visibility = "hidden";
}

// Function to send the Email Identity to Salesforce
function submitAuthForm() {
    const emailInput = document.getElementById("email").value;
    const firstNameInput = document.getElementById("firstname").value;
    const lastNameInput = document.getElementById("lastname").value;

    if (emailInput) {
        // This is the crucial part: sending the identity to Salesforce Personalization
        SalesforceInteractions.sendEvent({
            interaction: {
                name: "User Login" 
            },
            user: {
                identities: {
                    emailAddress: emailInput // Matches your "Exact Normalized Email" rule!
                },
                attributes: {
                    firstName: firstNameInput,
                    lastName: lastNameInput
                }
            }
        }).then(() => {
            console.log("Success! Identity sent to Salesforce:", emailInput);
            hideAuthForm(); 
            // Optional: location.reload(); // Reload the page to instantly see personalized content
        });
    } else {
        console.warn("No email provided.");
    }
}
