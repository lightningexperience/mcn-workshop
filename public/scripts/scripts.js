// scripts.js
// UI show/hide for the demo login form
function displayAuthForm() {
  const el = document.getElementById("loginform");
  if (el) el.style.visibility = "visible";
}

function hideAuthForm() {
  const el = document.getElementById("loginform");
  if (el) el.style.visibility = "hidden";
}

// Submit fake auth → identity + partyIdentification events
function submitAuthForm() {
  const form = document.getElementById("authenticationForm");
  if (!form) return;

  const inputs = form.elements;
  SalesforceInteractions.sendEvent({
    user: {
      attributes: {
        eventType: 'identity',
        firstName: inputs["firstname"]?.value || '',
        lastName:  inputs["lastname"]?.value  || '',
        email:     inputs["email"]?.value     || '',
        sourcePageType: window.location.href,
        isAnonymous: 1
      }
    }
  });

  SalesforceInteractions.sendEvent({
    user: {
      attributes: {
        eventType: 'partyIdentification',
        IDName: "Web",
        IDType: "WebTracking"
      }
    }
  });
}

// Add-to-cart event for PDPs
function addToCart(productId) {
  SalesforceInteractions.sendEvent({
    interaction: {
      name: "Add To Cart",
      lineItem: {
        catalogObjectType: "Product",
        catalogObjectId: (typeof getProductId === 'function') ? getProductId() : String(productId || ''),
        quantity: 1,
        price: 148.00,
        currency: "USD"
      }
    }
  });
}
