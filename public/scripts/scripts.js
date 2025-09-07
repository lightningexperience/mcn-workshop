// scripts.js
function displayAuthForm(){ const el=document.getElementById("loginform"); if(el) el.style.visibility="visible"; }
function hideAuthForm(){ const el=document.getElementById("loginform"); if(el) el.style.visibility="hidden"; }

function setKnownIdentity({ email, firstName='', lastName='' } = {}) {
  if (!email) return;

  // Optional helper signal
  SalesforceInteractions.sendEvent({
    interaction:{ name:'emailCapture' },
    user:{ attributes:{ eventType:'contactPointEmail', email:String(email) } }
  });

  // Known identity; DC will merge by email
  SalesforceInteractions.sendEvent({
    user:{ attributes:{
      eventType:'identity',
      isAnonymous:"0",
      email:String(email),
      firstName:String(firstName||''),
      lastName:String(lastName||'')
    } }
  });
}

function submitAuthForm(){
  const f=document.getElementById("authenticationForm"); if(!f) return;
  setKnownIdentity({
    email: f.elements["email"]?.value || '',
    firstName: f.elements["firstname"]?.value || '',
    lastName: f.elements["lastname"]?.value || ''
  });
  hideAuthForm();
}

function addToCart(productId){
  SalesforceInteractions.sendEvent({
    interaction:{ name:"Add To Cart",
      lineItem:{ catalogObjectType:"Product",
        catalogObjectId:(typeof getProductId==='function')?getProductId():String(productId||''),
        quantity:1, price:148.00, currency:"USD"
      }
    }
  });
}
