(() => {
 const $=id=>document.getElementById(id);
 const client=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
 const owner=(window.ADMIN_EMAIL||"").toLowerCase();
 const say=(id,msg)=>{if($(id))$(id).textContent=msg;};
 function show(session){const ok=!!session&&session.user.email?.toLowerCase()===owner;$("login-panel").classList.toggle("hidden",ok);$("dashboard").classList.toggle("hidden",!ok);$("logout").classList.toggle("hidden",!ok);if(ok)loadProducts();else if(session)client.auth.signOut();}
 async function check(){const {data}=await client.auth.getSession();show(data.session);}
 $("login").addEventListener("click",async()=>{say("login-message","Logging in…");const {data,error}=await client.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});if(error){say("login-message",error.message);return;}if(data.user.email.toLowerCase()!==owner){await client.auth.signOut();say("login-message","This email is not authorized.");return;}say("login-message","Login successful.");show(data.session);});
 $("logout").addEventListener("click",async()=>{await client.auth.signOut();show(null);});
 function clearForm(){$("product-form").reset();$("product-id").value="";$("form-title").textContent="Add a product";say("form-message","");}
 $("cancel-edit").addEventListener("click",clearForm);
 async function loadProducts(){const {data,error}=await client.from("products").select("*").order("created_at",{ascending:false});if(error){$("admin-products").textContent=error.message;return;}if(!data.length){$("admin-products").textContent="Abhi koi product nahi. Upar form se add karein.";return;}
 $("admin-products").innerHTML=data.map(p=>'<div class="admin-product"><div><b>'+safe(p.name)+'</b><small>'+safe(p.category)+' · '+safe(p.price||"Price on request")+(p.active?"":" · Hidden")+'</small></div><div class="admin-actions"><button class="admin-btn secondary" data-edit="'+p.id+'">Edit</button><button class="admin-btn danger" data-delete="'+p.id+'">Delete</button></div></div>').join("");
 $("admin-products").querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>edit(data.find(p=>p.id===b.dataset.edit)));
 $("admin-products").querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>remove(b.dataset.delete));}
 function safe(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
 function edit(p){$("product-id").value=p.id;$("name").value=p.name;$("category").value=p.category;$("price").value=p.price||"";$("description").value=p.description||"";$("form-title").textContent="Edit product";window.scrollTo({top:0,behavior:"smooth"});}
 async function remove(id){if(!confirm("Is product ko delete karna hai?"))return;const {error}=await client.from("products").delete().eq("id",id);if(error){alert(error.message);return;}loadProducts();}
 $("product-form").addEventListener("submit",async e=>{e.preventDefault();say("form-message","Saving product…");const {data:{user}}=await client.auth.getUser();if(!user||user.email.toLowerCase()!==owner){say("form-message","Owner login required.");return;}
 let image_url=null;const oldId=$("product-id").value;if(oldId){const {data:old}=await client.from("products").select("image_url").eq("id",oldId).single();image_url=old?.image_url||null;}
 const file=$("photo").files[0];if(file){if(!file.type.startsWith("image/")){say("form-message","Please select an image.");return;}const ext=(file.name.split(".").pop()||"jpg").replace(/[^a-z0-9]/gi,"");const path=user.id+"/"+Date.now()+"."+ext;const {error:upErr}=await client.storage.from("product-images").upload(path,file,{upsert:true,contentType:file.type});if(upErr){say("form-message","Photo upload failed: "+upErr.message);return;}image_url=client.storage.from("product-images").getPublicUrl(path).data.publicUrl;}
 const payload={name:$("name").value.trim(),category:$("category").value,price:$("price").value.trim(),description:$("description").value.trim(),...(image_url?{image_url}:{})};
 const result=oldId?await client.from("products").update(payload).eq("id",oldId):await client.from("products").insert(payload);
 if(result.error){say("form-message","Save failed: "+result.error.message);return;}say("form-message","Product saved successfully.");clearForm();loadProducts();});
 client.auth.onAuthStateChange((_event,session)=>show(session));check();
})();