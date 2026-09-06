import{s as w,a as Be,g as ke,b as Le}from"./supabase.B49gIuNd.js";import{b as $e,c as Se}from"./idb.C3fpF4UB.js";import"./hoisted.BgEWZmo6.js";const oe=document.getElementById("admin-static-data"),{staticPosts:he=[],staticCourses:W=[]}=oe?JSON.parse(oe.textContent||"{}"):{staticPosts:[],staticCourses:[]},_e=4322,A=["localhost","127.0.0.1","::1"].includes(window.location.hostname)||window.location.hostname.startsWith("192.168.")||window.location.hostname.startsWith("10.")||window.location.hostname.endsWith(".local"),x=A?`${window.location.protocol}//${window.location.hostname}:${_e}`:window.location.origin,f=sessionStorage.getItem("rkmidigi_admin_token"),Ce=parseInt(sessionStorage.getItem("rkmidigi_admin_expires")||"0",10);(!f||Date.now()>Ce)&&(sessionStorage.removeItem("rkmidigi_admin_token"),sessionStorage.removeItem("rkmidigi_admin_user"),sessionStorage.removeItem("rkmidigi_admin_expires"),window.location.replace("/admin/login?auth_prompt=1"));function be(){localStorage.removeItem("rkmidigi_admin_token"),localStorage.removeItem("rkmidigi_admin_user"),sessionStorage.removeItem("rkmidigi_admin_token"),sessionStorage.removeItem("rkmidigi_admin_user"),sessionStorage.removeItem("rkmidigi_admin_expires"),window.location.href="/admin/login?logged_out=1"}const ie=document.getElementById("logout-btn"),ae=document.getElementById("modal-logout-btn");ie&&ie.addEventListener("click",be);ae&&ae.addEventListener("click",be);const le=document.getElementById("profile-btn"),B=document.getElementById("profile-modal"),re=document.getElementById("close-profile-btn"),de=document.getElementById("modal-close-btn");function Ae(){B&&B.classList.remove("hidden")}function P(){B&&B.classList.add("hidden")}le&&le.addEventListener("click",Ae);re&&re.addEventListener("click",P);de&&de.addEventListener("click",P);B&&B.addEventListener("click",n=>{n.target===B&&P()});window.addEventListener("keydown",n=>{n.key==="Escape"&&P()});let h=[];function c(n,e=!1){const t=document.getElementById("status-toast"),s=document.getElementById("status-text");t&&s&&(s.textContent=n,t.className=`my-4 p-3 rounded-lg border text-xs font-bold flex items-center justify-between ${e?"bg-amber-50 border-amber-300 text-amber-900":"bg-emerald-50 border-emerald-300 text-emerald-800"}`,t.classList.remove("hidden"),setTimeout(()=>{t.classList.add("hidden")},6e3))}async function Pe(){let n=[...he||[]];try{const e=JSON.parse(localStorage.getItem("rkmidigi_custom_posts")||"[]");if(Array.isArray(e))for(const t of e)n.some(s=>s.slug===t.slug)||n.unshift(t)}catch{}try{const e=await Se();if(Array.isArray(e))for(const t of e){const s=n.findIndex(i=>i.slug===t.slug);s>-1?n[s]={...n[s],...t}:n.unshift(t)}}catch{}n=n.map(e=>{try{const t=localStorage.getItem(`rkmidigi_post_edit_${e.slug}`);if(t)return{...e,...JSON.parse(t)}}catch{}return e});try{const e=JSON.parse(localStorage.getItem("rkmidigi_post_toggles")||"{}");n=n.map(t=>typeof e[t.slug]=="boolean"?{...t,published:e[t.slug]}:t)}catch{}try{const e=JSON.parse(localStorage.getItem("rkmidigi_deleted_posts")||"[]");Array.isArray(e)&&(n=n.filter(t=>!e.includes(t.slug)))}catch{}try{const{data:e,error:t}=await w.from("posts").select("*");if(!t&&Array.isArray(e)&&e.length>0)for(const s of e){const i={slug:s.slug,title:s.title,category:s.category,date:s.date,readTime:s.read_time,featured:s.featured,published:s.published,youtubeUrl:s.youtube_url,image:s.image,summary:s.summary,tags:Array.isArray(s.tags)?s.tags:[],body:s.body,author:s.author},o=n.findIndex(l=>l.slug===i.slug);o>-1?n[o]={...n[o],...i}:n.unshift(i)}}catch{}if(A)try{const e=await fetch(`${x}/api/admin/posts`,{headers:{Authorization:`Bearer ${f}`}});if(e.ok){const t=await e.json();t.success&&Array.isArray(t.posts)&&t.posts.length>0&&(n=t.posts)}}catch{}h=n,K(h),X(h)}function K(n){const e=document.getElementById("stat-total"),t=document.getElementById("stat-published"),s=document.getElementById("stat-drafts"),i=document.getElementById("stat-videos");e&&(e.textContent=n.length.toString()),t&&(t.textContent=n.filter(o=>o.published!==!1).length.toString()),s&&(s.textContent=n.filter(o=>o.published===!1).length.toString()),i&&(i.textContent=n.filter(o=>!!o.youtubeUrl).length.toString())}function X(n){const e=document.getElementById("posts-table-body");if(e){if(n.length===0){e.innerHTML=`
        <tr>
          <td colspan="6" class="py-12 text-center text-slate-500">
            <p class="text-sm font-bold text-slate-700">No blog posts found.</p>
            <p class="text-xs text-slate-400 mt-1">Click "+ New Post / Video" above to create your first article.</p>
          </td>
        </tr>
      `;return}e.innerHTML=n.map(t=>{const s=!!t.youtubeUrl,i=t.featured,o=t.published!==!1;return`
        <tr class="hover:bg-slate-50/80 transition-colors">
          <td class="py-3.5 px-4">
            <div class="flex items-center gap-2.5">
              ${i?'<span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">FEATURED</span>':""}
              ${o?"":'<span class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">DRAFT</span>'}
              <a href="/admin/edit?slug=${encodeURIComponent(t.slug)}" class="font-bold text-black hover:text-[#16A34A] transition-colors leading-snug">
                ${t.title}
              </a>
            </div>
            <div class="text-[11px] text-slate-500 font-mono mt-1">
              Slug: /blog/${t.slug} • ${t.readTime||"4 min read"}
            </div>
          </td>

          <td class="py-3.5 px-4 whitespace-nowrap">
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
              ${t.category}
            </span>
          </td>

          <td class="py-3.5 px-4 whitespace-nowrap text-slate-600 font-mono text-xs">
            ${t.date||"N/A"}
          </td>

          <td class="py-3.5 px-4 whitespace-nowrap">
            ${s?`
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700 border border-red-200">
                <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                VIDEO
              </span>
            `:`
              <span class="text-[11px] text-slate-400 font-mono">Article Only</span>
            `}
          </td>

          <!-- Single Publish / Unpublish Toggle Button -->
          <td class="py-3.5 px-4 whitespace-nowrap">
            <button 
              type="button" 
              onclick="togglePublishPost('${t.slug}', this)"
              id="pub-btn-${t.slug}"
              class="publish-toggle-btn inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${o?"bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-amber-100 hover:text-amber-900 hover:border-amber-300":"bg-amber-100 text-amber-900 border border-amber-300 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-300"}"
              title="${o?"Status: Published. Click to Unpublish (set to Draft)":"Status: Unpublished. Click to Publish (make Live)"}"
            >
              <span class="w-2 h-2 rounded-full ${o?"bg-emerald-500":"bg-amber-500"}"></span>
              <span class="btn-label">${o?"Published":"Unpublished"}</span>
            </button>
          </td>

          <td class="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
            <button 
              type="button" 
              onclick="openSocialPushModal('${t.slug}')"
              class="inline-block px-2.5 py-1 rounded bg-[#112649] hover:bg-[#1d3d75] text-white font-bold text-xs transition-colors shadow-xs"
              title="Broadcast & Push to Social Media"
            >
              🚀 Push
            </button>
            <a 
              href="/admin/edit?slug=${encodeURIComponent(t.slug)}" 
              class="inline-block px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              Edit
            </a>
            <a 
              href="/blog/${t.slug}/" 
              target="_blank" 
              class="inline-block px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              View ↗
            </a>
            <button 
              type="button" 
              onclick="deletePost('${t.slug}', '${t.title.replace(/'/g,"\\'")}')"
              class="inline-block px-2.5 py-1 rounded text-red-600 hover:bg-red-50 hover:text-red-800 font-bold text-xs transition-colors"
            >
              Delete
            </button>
          </td>
        </tr>
      `}).join("")}}async function Me(n,e){const t=h.find(s=>s.slug===n);if(t){if(e&&e.classList.add("opacity-50","pointer-events-none"),t.published=!t.published,K(h),e){const s=t.published;e.className=`publish-toggle-btn inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${s?"bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-amber-100 hover:text-amber-900 hover:border-amber-300":"bg-amber-100 text-amber-900 border border-amber-300 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-300"}`,e.title=s?"Status: Published. Click to Unpublish (set to Draft)":"Status: Unpublished. Click to Publish (make Live)",e.innerHTML=`<span class="w-2 h-2 rounded-full ${s?"bg-emerald-500":"bg-amber-500"}"></span><span class="btn-label">${s?"Published":"Unpublished"}</span>`}try{const s=JSON.parse(localStorage.getItem("rkmidigi_post_toggles")||"{}");s[n]=t.published,localStorage.setItem("rkmidigi_post_toggles",JSON.stringify(s)),localStorage.setItem("rkmidigi_post_toggle",JSON.stringify({slug:n,published:t.published,timestamp:Date.now()}))}catch{}try{new BroadcastChannel("rkmidigi_blog_channel").postMessage({type:"POST_PUBLISH_TOGGLED",slug:n,published:t.published,timestamp:Date.now()})}catch{}try{await w.from("posts").update({published:t.published}).eq("slug",n)}catch{}if(A)try{await fetch(`${x}/api/admin/posts/${n}/toggle-publish`,{method:"POST",headers:{Authorization:`Bearer ${f}`}})}catch{}c(t.published?"✅ Post marked as Published!":"⚠️ Post marked as Unpublished (Draft)!"),M(),e&&e.classList.remove("opacity-50","pointer-events-none")}}window.togglePublishPost=Me;window.deletePost=async(n,e)=>{if(confirm(`Are you sure you want to remove the post "${e}" from the active post store?`)){try{const t=JSON.parse(localStorage.getItem("rkmidigi_deleted_posts")||"[]");t.includes(n)||(t.push(n),localStorage.setItem("rkmidigi_deleted_posts",JSON.stringify(t)));const i=JSON.parse(localStorage.getItem("rkmidigi_custom_posts")||"[]").filter(o=>o.slug!==n);localStorage.setItem("rkmidigi_custom_posts",JSON.stringify(i))}catch{}try{await $e(n)}catch{}try{new BroadcastChannel("rkmidigi_blog_channel").postMessage({type:"POST_DELETED",slug:n,timestamp:Date.now()})}catch{}try{await w.from("posts").delete().eq("slug",n)}catch{}if(A)try{await fetch(`${x}/api/admin/posts/${n}`,{method:"DELETE",headers:{Authorization:`Bearer ${f}`}})}catch{}h=h.filter(t=>t.slug!==n),K(h),X(h),c(`🗑️ Post "${e}" was removed.`)}};let _="";function Te(n){let e=h.find(b=>b.slug===n);e||(e=(he||[]).find(b=>b.slug===n)),e||(e={slug:n,title:n,summary:"",tags:[]}),_=n;const t=document.getElementById("social-push-modal"),s=document.getElementById("push-modal-slug"),i=document.getElementById("push-modal-title"),o=document.getElementById("push-modal-copy"),l=document.getElementById("push-modal-char-count"),m=document.getElementById("push-modal-status");s&&(s.textContent=`/blog/${n}`),i&&(i.textContent=e.title),m&&m.classList.add("hidden");const d=`${window.location.origin}/company-profile`,r=`${window.location.origin}/blog/${n}/`,u=Array.isArray(e.tags)?e.tags:[],p=(u.length?u.map(b=>"#"+b.replace(/\s+/g,"")):["#AIGovernance","#RKMIDIGILABS"]).join(" "),a=`📢 ${e.title}

${e.summary?e.summary+`

`:""}📖 Article Analysis: ${r}
🏢 Company Profile & Corporate Brochure: ${d}

${p}`;o&&(o.value=a,l&&(l.textContent=`${a.length} chars`)),t&&t.classList.remove("hidden")}window.openSocialPushModal=Te;const S=document.getElementById("social-push-modal"),ce=document.getElementById("close-push-modal-btn"),ue=document.getElementById("done-push-modal-btn"),E=document.getElementById("push-modal-copy"),me=document.getElementById("push-modal-char-count");function Y(){S&&S.classList.add("hidden")}ce&&ce.addEventListener("click",Y);ue&&ue.addEventListener("click",Y);S&&S.addEventListener("click",n=>{n.target===S&&Y()});E&&E.addEventListener("input",()=>{me&&(me.textContent=`${E.value.length} chars`)});document.getElementById("modal-copy-text-btn")?.addEventListener("click",async()=>{const n=E?.value||"";if(n)try{await navigator.clipboard.writeText(n),c("📋 Copied full social message & links to clipboard! Ready to paste into LinkedIn or WhatsApp.")}catch{E.select(),document.execCommand("copy"),c("📋 Copied to clipboard!")}});document.getElementById("modal-launch-linkedin")?.addEventListener("click",()=>{const n=`${window.location.origin}/blog/${_}/`;window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(n)}`,"_blank","width=600,height=600")});document.getElementById("modal-launch-twitter")?.addEventListener("click",()=>{const n=E?.value||"";window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(n)}`,"_blank","width=600,height=600")});document.getElementById("modal-launch-whatsapp")?.addEventListener("click",()=>{const n=E?.value||"";window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(n)}`,"_blank","width=800,height=700")});document.getElementById("modal-launch-facebook")?.addEventListener("click",()=>{const n=`${window.location.origin}/blog/${_}/`;window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(n)}`,"_blank","width=600,height=600")});const k=document.getElementById("modal-webhook-push-btn");k&&k.addEventListener("click",async()=>{const n=h.find(e=>e.slug===_);if(n){k.setAttribute("disabled","true"),k.innerHTML="<span>Broadcasting...</span>";try{const t=await(await fetch(`${x}/api/admin/social-push`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${f}`},body:JSON.stringify({title:n.title,summary:n.summary,url:`/blog/${_}/`,customCopy:E?.value,tags:n.tags})})).json(),s=document.getElementById("push-modal-status");s&&(s.textContent=t.message||"Broadcasted successfully to social media!",s.className="text-xs font-bold text-center mt-2 text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200",s.classList.remove("hidden"))}catch{const t=document.getElementById("push-modal-status");t&&(t.textContent="Broadcast request completed locally.",t.className="text-xs font-bold text-center mt-2 text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200",t.classList.remove("hidden"))}finally{k.removeAttribute("disabled"),k.innerHTML="<span>🚀 Broadcast via Configured Webhook Engine</span>"}}});const L=document.getElementById("rebuild-btn");L&&L.addEventListener("click",async()=>{L.setAttribute("disabled","true"),L.innerHTML="<span>Rebuilding...</span>";try{const e=await(await fetch(`${x}/api/admin/rebuild`,{method:"POST",headers:{Authorization:`Bearer ${f}`}})).json();e.success?c("Site rebuild completed successfully!"):c(e.error||"Rebuild failed.",!0)}catch{c("Network error triggering rebuild.",!0)}finally{L.removeAttribute("disabled"),L.innerHTML='<svg class="w-3.5 h-3.5 text-[#16A34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg><span>Rebuild Site</span>'}});const F=document.getElementById("search-input"),J=document.getElementById("category-filter"),V=document.getElementById("status-filter");function M(){const n=(F?.value||"").toLowerCase().trim(),e=J?.value||"All",t=V?.value||"All",s=h.filter(i=>{const o=!n||i.title.toLowerCase().includes(n)||i.slug.toLowerCase().includes(n)||i.tags&&i.tags.some(r=>r.toLowerCase().includes(n)),l=e==="All"||i.category===e,m=i.published!==!1;return o&&l&&(t==="All"||t==="Published"&&m||t==="Unpublished"&&!m)});X(s)}F&&F.addEventListener("input",M);J&&J.addEventListener("change",M);V&&V.addEventListener("change",M);const Ue=document.getElementById("social-settings-btn"),fe=document.getElementById("social-settings-modal"),Re=document.getElementById("close-social-settings-btn"),De=document.getElementById("cancel-social-settings-btn"),Ne=document.getElementById("social-settings-form");async function je(){try{const e=await(await fetch(`${x}/api/admin/social-config`,{headers:{Authorization:`Bearer ${f}`}})).json();if(e.success&&e.config){const t=e.config,s=t.channels||{},i=document.getElementById("cfg-linkedin"),o=document.getElementById("cfg-twitter"),l=document.getElementById("cfg-youtube"),m=document.getElementById("cfg-facebook"),d=document.getElementById("cfg-whatsapp"),r=document.getElementById("cfg-brochure"),u=document.getElementById("cfg-webhook-enabled"),p=document.getElementById("cfg-webhook-url");i&&(i.value=s.linkedin?.url||"https://www.linkedin.com/company/rkmidigilabs"),o&&(o.value=s.twitter?.url||"https://x.com/rkmidigilabs"),l&&(l.value=s.youtube?.url||"https://www.youtube.com/@rkmidigilabs"),m&&(m.value=s.facebook?.url||"https://www.facebook.com/rkmidigilabs"),d&&(d.value=s.whatsapp?.handle||"+91 9371650121"),r&&(r.value=t.brochureUrl||`${window.location.origin}/company-profile`),u&&(u.checked=!!t.webhooks?.enabled),p&&(p.value=t.webhooks?.webhookUrl||"")}}catch{}}function Oe(){je(),fe?.classList.remove("hidden")}function Q(){fe?.classList.add("hidden")}Ue?.addEventListener("click",Oe);Re?.addEventListener("click",Q);De?.addEventListener("click",Q);Ne?.addEventListener("submit",async n=>{n.preventDefault();const e={organization:"RKMIDIGILABS",email:"rkmvedant@gmail.com",mobile:"+91 9371650121",brochureUrl:document.getElementById("cfg-brochure").value,channels:{linkedin:{name:"LinkedIn",url:document.getElementById("cfg-linkedin").value,active:!0},twitter:{name:"X (Twitter)",url:document.getElementById("cfg-twitter").value,active:!0},youtube:{name:"YouTube",url:document.getElementById("cfg-youtube").value,active:!0},facebook:{name:"Facebook",url:document.getElementById("cfg-facebook").value,active:!0},whatsapp:{name:"WhatsApp",handle:document.getElementById("cfg-whatsapp").value,active:!0}},webhooks:{enabled:document.getElementById("cfg-webhook-enabled").checked,webhookUrl:document.getElementById("cfg-webhook-url").value}};try{const s=await(await fetch(`${x}/api/admin/social-config`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${f}`},body:JSON.stringify(e)})).json();s.success?(c("Social accounts and webhook settings saved!"),Q()):c(s.error||"Failed to save social settings",!0)}catch{c("Error connecting to Admin API server.",!0)}});const ye=document.getElementById("social-push-modal"),He=document.getElementById("close-social-push-btn");let g=null;window.openSocialPushModal=n=>{const e=h.find(u=>u.slug===n);if(!e)return;g=e;const t=document.getElementById("push-post-title"),s=document.getElementById("push-post-url"),i=document.getElementById("push-copy"),o=document.getElementById("push-status-note");o&&o.classList.add("hidden"),t&&(t.textContent=e.title);const l=`${window.location.origin}/blog/${e.slug}`,m=`${window.location.origin}/company-profile`;s&&(s.textContent=l);const d=Array.isArray(e.tags)?e.tags.map(u=>"#"+u.replace(/\s+/g,"")).join(" "):"#AIGovernance #RKMIDIGILABS",r=`📢 ${e.title}

${e.summary||""}

📖 Read full analysis: ${l}
🏢 Company Profile & Corporate Brochure: ${m}

${d}`;i&&(i.value=r),ye?.classList.remove("hidden")};function qe(){ye?.classList.add("hidden")}He?.addEventListener("click",qe);function T(){return document.getElementById("push-copy")?.value||""}document.getElementById("btn-push-linkedin")?.addEventListener("click",()=>{if(!g)return;const n=`${window.location.origin}/blog/${g.slug}`,e=`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(n)}`;window.open(e,"_blank","width=600,height=600")});document.getElementById("btn-push-twitter")?.addEventListener("click",()=>{if(!g)return;const n=T(),e=`https://twitter.com/intent/tweet?text=${encodeURIComponent(n)}`;window.open(e,"_blank","width=600,height=600")});document.getElementById("btn-push-whatsapp")?.addEventListener("click",()=>{if(!g)return;const n=T(),e=`https://api.whatsapp.com/send?text=${encodeURIComponent(n)}`;window.open(e,"_blank","width=800,height=700")});document.getElementById("btn-push-facebook")?.addEventListener("click",()=>{if(!g)return;const n=`${window.location.origin}/blog/${g.slug}`,e=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(n)}`;window.open(e,"_blank","width=600,height=600")});document.getElementById("btn-push-all")?.addEventListener("click",()=>{if(!g)return;const n=T(),e=`${window.location.origin}/blog/${g.slug}`;window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(e)}`,"_blank"),window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(n)}`,"_blank"),window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(n)}`,"_blank"),window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(e)}`,"_blank"),c("Launched LinkedIn, X, WhatsApp, and Facebook share composers!")});document.getElementById("btn-push-webhook")?.addEventListener("click",async()=>{if(!g)return;const n=document.getElementById("btn-push-webhook"),e=document.getElementById("push-status-note");n.disabled=!0,n.textContent="Dispatching...";try{const s=await(await fetch(`${x}/api/admin/social-push`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${f}`},body:JSON.stringify({title:g.title,summary:g.summary,url:`/blog/${g.slug}`,customCopy:T(),tags:g.tags})})).json();s.success?(c("Social broadcast dispatched & logged successfully!"),e&&(e.className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-mono",e.textContent=`✓ Broadcast recorded (ID: ${s.dispatchRecord?.id}). Webhook status: ${s.webhookStatus}.`,e.classList.remove("hidden"))):c(s.error||"Failed to dispatch broadcast",!0)}catch{c("Error dispatching social broadcast.",!0)}finally{n.disabled=!1,n.innerHTML="<span>📡 Dispatch to Webhook API</span>"}});const Fe=document.getElementById("inquiries-btn"),xe=document.getElementById("inquiries-modal"),Je=document.getElementById("close-inquiries-btn"),Ve=document.getElementById("done-inquiries-btn"),pe=document.getElementById("inquiries-count-badge"),H=document.getElementById("inquiries-list-container"),z=document.getElementById("template-viewer-modal"),ze=document.getElementById("close-template-viewer-btn"),ge=document.getElementById("template-viewer-ref"),$=document.getElementById("template-viewer-content");let q=[];async function Z(){try{const e=await(await fetch(`${x}/api/admin/inquiries`,{headers:{Authorization:`Bearer ${f}`}})).json();e.success&&(q=e.inquiries||[],pe&&(pe.textContent=q.length.toString()),Ge(q))}catch(n){console.error("Error fetching inquiries:",n)}}function Ge(n){if(H){if(n.length===0){H.innerHTML=`
        <div class="py-12 text-center text-slate-500">
          <svg class="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          <p class="text-sm font-bold text-slate-700">No client inquiries yet.</p>
          <p class="text-xs text-slate-400 mt-1">When prospective clients click "Enquire with Email" on your services, their submissions will be delivered to rkmvedant@gmail.com and cataloged here.</p>
        </div>
      `;return}H.innerHTML=`
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
          <thead class="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th class="py-3 px-4">Ref & Date</th>
              <th class="py-3 px-4">Client Contact</th>
              <th class="py-3 px-4">Service Offering</th>
              <th class="py-3 px-4">Requirements</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            ${n.map(e=>{const t=e.timestamp?new Date(e.timestamp).toLocaleDateString():"Recent";return`
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                    <div class="font-bold text-black">${e.inquiryId}</div>
                    <div class="text-slate-400">${t}</div>
                  </td>
                  <td class="py-3.5 px-4">
                    <div class="font-bold text-black">${e.name}</div>
                    <div class="text-[11px] text-slate-500 font-mono">
                      <a href="mailto:${e.email}" class="hover:underline text-emerald-700">${e.email}</a>
                    </div>
                    <div class="text-[11px] text-slate-500 font-mono">${e.phone}</div>
                  </td>
                  <td class="py-3.5 px-4">
                    <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ${e.service}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-slate-700 max-w-xs truncate" title="${e.description}">
                    ${e.description}
                  </td>
                  <td class="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                    <button 
                      type="button" 
                      onclick="window.viewInquiryTemplate('${e.inquiryId}')"
                      class="px-2.5 py-1 rounded bg-[#112649] hover:bg-[#1d3d75] text-white font-bold text-[11px] transition-colors shadow-xs"
                      title="Preview Corporate Email Template"
                    >
                      View Template
                    </button>
                    <a 
                      href="mailto:${e.email}?subject=${encodeURIComponent(`Re: RKMIDIGILABS Inquiry - ${e.service}`)}"
                      class="inline-block px-2.5 py-1 rounded bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-[11px] transition-colors shadow-xs"
                      title="Reply via Email"
                    >
                      Reply
                    </a>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>
    `}}async function We(n){if(!(!z||!$)){ge&&(ge.textContent=n),$.innerHTML='<div class="p-8 text-center text-xs text-slate-500">Loading formatted email template...</div>',z.classList.remove("hidden");try{const t=await(await fetch(`${x}/api/admin/inquiries/${n}`,{headers:{Authorization:`Bearer ${f}`}})).json();t.success&&t.html?$.innerHTML=t.html:$.innerHTML=`<div class="p-8 text-center text-xs text-red-500">${t.error||"Failed to load template."}</div>`}catch{$.innerHTML='<div class="p-8 text-center text-xs text-red-500">Error loading email template archive.</div>'}}}window.viewInquiryTemplate=We;function Ke(){Z(),xe?.classList.remove("hidden")}function ve(){xe?.classList.add("hidden")}Fe?.addEventListener("click",Ke);Je?.addEventListener("click",ve);Ve?.addEventListener("click",ve);ze?.addEventListener("click",()=>{z?.classList.add("hidden")});const Xe=["articles","courses","students","inquiries"];function U(n){Xe.forEach(e=>{const t=document.getElementById(`tab-btn-${e}`),s=document.getElementById(`section-${e}`);e===n?(t?.classList.remove("bg-white","text-slate-700","hover:bg-slate-50","border-slate-300"),t?.classList.add("bg-[#112649]","text-white","border-[#112649]","shadow-sm"),s?.classList.remove("hidden")):(t?.classList.remove("bg-[#112649]","text-white","border-[#112649]","shadow-sm"),t?.classList.add("bg-white","text-slate-700","hover:bg-slate-50","border-slate-300"),s?.classList.add("hidden"))}),n==="courses"&&ee().then(()=>D()),n==="students"&&N(),n==="inquiries"&&Z()}document.getElementById("tab-btn-articles")?.addEventListener("click",()=>U("articles"));document.getElementById("tab-btn-courses")?.addEventListener("click",()=>U("courses"));document.getElementById("tab-btn-students")?.addEventListener("click",()=>U("students"));document.getElementById("tab-btn-inquiries")?.addEventListener("click",()=>U("inquiries"));let v=[];function R(){try{const n=localStorage.getItem("rkmidigi_custom_courses");if(n){const e=JSON.parse(n);if(Array.isArray(e)&&e.length>0)return e}}catch{}return W||[]}function Ye(n){try{localStorage.setItem("rkmidigi_custom_courses",JSON.stringify(n))}catch{}}async function ee(){try{const{data:n,error:e}=await w.from("courses").select("*, lessons(*)").order("price_inr",{ascending:!1});if(!e&&Array.isArray(n)&&n.length>0)return v=n.map(t=>({id:t.id,slug:t.slug,title:t.title,subtitle:t.subtitle||"",summary:t.summary||"",description:t.description||"",category:t.category||"AI Governance",level:t.level||"Practitioner",priceInr:Number(t.price_inr||4999),originalPriceInr:Number(t.original_price_inr||14999),durationHours:t.duration_hours||"6 Hours",totalLessons:(t.lessons||[]).length||t.total_lessons||8,thumbnailUrl:t.thumbnail_url||"/images/rkmidigilabs-logo.jpg",featured:!!t.featured,lessons:(t.lessons||[]).sort((s,i)=>(s.order_index||0)-(i.order_index||0)).map(s=>({id:s.id,orderIndex:s.order_index,title:s.title,duration:s.duration,description:s.description||"",videoUrl:s.video_url,isFreePreview:!!s.is_free_preview}))})),v}catch(n){console.warn("Could not query Supabase courses:",n)}return v=R(),v}function D(){const n=document.getElementById("admin-courses-container");if(!n)return;const e=v.length>0?v:R(),t=document.getElementById("stat-courses");t&&(t.textContent=e.length.toString()),n.innerHTML=e.map((s,i)=>{const o=s.lessons||[],l=o.filter(d=>d.isFreePreview).length,m=o.map((d,r)=>`
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all text-xs">
          <div class="flex items-center gap-3 min-w-0 pr-2">
            <span class="w-6 h-6 rounded-full bg-[#112649] text-white flex items-center justify-center text-[10px] font-mono font-black shrink-0">
              ${r+1}
            </span>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900 truncate">${d.title}</span>
                ${d.isFreePreview?'<span class="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Free Preview</span>':'<span class="px-2 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">Premium Locked</span>'}
              </div>
              <div class="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-3">
                <span>⏱ ${d.duration||"15:00"}</span>
                <span>🎥 Video: <code class="text-slate-700 bg-slate-200 px-1 py-0.2 rounded">${(d.videoUrl||"Not set").substring(0,28)}...</code></span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            <a 
              href="/courses/${s.slug}/learn" 
              target="_blank" 
              class="px-2.5 py-1.5 rounded-lg font-bold text-[11px] bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-1"
              title="Test playback in classroom player"
            >
              <span>▶ Test</span>
            </a>
            <button 
              type="button" 
              onclick="window.openLessonEdit('${s.id}', '${d.id}')"
              class="px-2.5 py-1.5 rounded-lg font-bold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
              title="Edit video embed URL or duration"
            >
              <span>✏️ Edit Video</span>
            </button>
          </div>
        </div>
      `).join("");return`
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <!-- Course Header -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#112649] text-white">
                  ${s.category||"Executive Education"}
                </span>
                <span class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300">
                  Level: ${s.level||"Practitioner"}
                </span>
              </div>
              <h3 class="text-lg font-black text-black tracking-tight">${s.title}</h3>
              <p class="text-xs text-slate-500 font-mono">${s.subtitle||""}</p>
            </div>

            <!-- Price & Actions -->
            <div class="flex flex-wrap items-center gap-3">
              <div class="text-right pr-2">
                <div class="text-lg font-black text-slate-900">₹${(s.priceInr||4999).toLocaleString("en-IN")}</div>
                <div class="text-[11px] text-slate-400 line-through font-mono">₹${(s.originalPriceInr||14999).toLocaleString("en-IN")}</div>
              </div>
              <a 
                href="/courses/${s.slug}" 
                target="_blank" 
                class="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 shadow-sm transition-colors flex items-center gap-1"
              >
                <span>Curriculum Page ↗</span>
              </a>
              <a 
                href="/courses/${s.slug}/learn" 
                target="_blank" 
                class="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#112649] text-white hover:bg-[#1a3666] shadow-sm transition-colors flex items-center gap-1"
              >
                <span>Classroom Player ↗</span>
              </a>
            </div>
          </div>

          <!-- Video Lessons Accordion List -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-mono font-bold uppercase text-slate-700">
                Video Modules & Lessons (${o.length} Modules • ${l} Free Previews)
              </span>
              <button 
                type="button" 
                onclick="window.openLessonEdit('${s.id}', 'new')"
                class="text-xs font-bold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1 cursor-pointer"
              >
                <span>+ Add Video Lesson</span>
              </button>
            </div>

            <div class="space-y-2 max-h-80 overflow-y-auto pr-1">
              ${m}
            </div>
          </div>
        </div>
      `}).join("")}const I=document.getElementById("push-to-supabase-btn");I?.addEventListener("click",async()=>{I&&(I.setAttribute("disabled","true"),I.textContent="Pushing Data..."),c("Pushing 3 Masterclasses and 24 Lessons to Supabase cloud database...");try{const n=W||[];for(const e of n){await w.from("courses").upsert({id:e.id,slug:e.slug,title:e.title,subtitle:e.subtitle,summary:e.summary,description:e.description,category:e.category,level:e.level,price_inr:e.priceInr,original_price_inr:e.originalPriceInr,duration_hours:e.durationHours,total_lessons:(e.lessons||[]).length,thumbnail_url:e.thumbnailUrl,featured:e.featured,is_published:!0});for(const t of e.lessons||[])await w.from("lessons").upsert({id:t.id,course_id:e.id,order_index:t.orderIndex,title:t.title,duration:t.duration,description:t.description,video_url:t.videoUrl,is_free_preview:t.isFreePreview})}try{const e=h||[];for(const t of e)await w.from("posts").upsert({slug:t.slug,title:t.title,category:t.category||"Technology",date:t.date,read_time:t.readTime||"5 min read",featured:!!t.featured,published:t.published!==!1,youtube_url:t.youtubeUrl||null,image:t.image||null,summary:t.summary||"",tags:t.tags||[],body:t.body||"",author:t.author||"RKMIDIGILABS"})}catch(e){console.warn("Posts table sync notice:",e)}c("All Masterclasses, Video Lessons, and Blog Articles successfully pushed to Supabase!"),await ee(),D()}catch(n){c("Error pushing data: "+(n.message||"Check database connection"),!0)}finally{I&&(I.removeAttribute("disabled"),I.innerHTML='<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg><span>Push Data to Supabase</span>')}});const we=document.getElementById("lesson-edit-modal"),Qe=document.getElementById("lesson-edit-form"),Ze=document.getElementById("close-lesson-modal-btn"),et=document.getElementById("cancel-lesson-modal-btn");function tt(n,e){const s=(v.length>0?v:R()).find(o=>o.id===n);if(!s)return;document.getElementById("edit-lesson-course-id").value=n;const i=document.getElementById("edit-lesson-course-name");if(i&&(i.textContent=s.title),e==="new")document.getElementById("edit-lesson-id").value=`les-${Date.now()}`,document.getElementById("edit-lesson-title").value="",document.getElementById("edit-lesson-duration").value="15:00",document.getElementById("edit-lesson-free").checked=!1,document.getElementById("edit-lesson-video").value="",document.getElementById("edit-lesson-desc").value="";else{const o=(s.lessons||[]).find(l=>l.id===e);if(!o)return;document.getElementById("edit-lesson-id").value=o.id,document.getElementById("edit-lesson-title").value=o.title||"",document.getElementById("edit-lesson-duration").value=o.duration||"15:00",document.getElementById("edit-lesson-free").checked=!!o.isFreePreview,document.getElementById("edit-lesson-video").value=o.videoUrl||"",document.getElementById("edit-lesson-desc").value=o.description||""}we?.classList.remove("hidden")}window.openLessonEdit=tt;function te(){we?.classList.add("hidden")}Ze?.addEventListener("click",te);et?.addEventListener("click",te);Qe?.addEventListener("submit",async n=>{n.preventDefault();const e=document.getElementById("edit-lesson-course-id").value,t=document.getElementById("edit-lesson-id").value,s=document.getElementById("edit-lesson-title").value.trim(),i=document.getElementById("edit-lesson-duration").value.trim(),o=document.getElementById("edit-lesson-free").checked,l=document.getElementById("edit-lesson-video").value.trim(),m=document.getElementById("edit-lesson-desc").value.trim(),d=v.length>0?v:R(),r=d.find(u=>u.id===e);if(r){Array.isArray(r.lessons)||(r.lessons=[]);const u=r.lessons.findIndex(a=>a.id===t),p={id:t,orderIndex:u>=0?r.lessons[u].orderIndex:r.lessons.length+1,title:s,duration:i,isFreePreview:o,videoUrl:l,description:m};u>=0?r.lessons[u]=p:r.lessons.push(p),Ye(d),D();try{await w.from("lessons").upsert({id:p.id,course_id:e,order_index:p.orderIndex,title:p.title,duration:p.duration,description:p.description,video_url:p.videoUrl,is_free_preview:p.isFreePreview})}catch{}try{await fetch(`${x}/api/admin/courses/lessons`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${f}`},body:JSON.stringify({courseId:e,lesson:p})})}catch{}te(),c(`Lesson "${s}" updated successfully!`)}});let G=[],C=[];async function N(){const n=document.getElementById("students-table-body");if(n){n.innerHTML='<tr><td colspan="5" class="py-8 text-center text-xs text-slate-500 font-mono">Syncing with Supabase Cloud Database...</td></tr>';try{G=await ke(),C=await Le()}catch(e){console.warn("Could not query Supabase helpers:",e)}ne()}}function ne(){const n=document.getElementById("students-table-body"),e=document.getElementById("stat-students"),t=document.getElementById("stat-enrollments"),s=document.getElementById("stat-revenue"),i=document.getElementById("tab-students-count");if(!n)return;const o=(document.getElementById("student-search-input")?.value||"").toLowerCase().trim(),l=document.getElementById("student-course-filter")?.value||"All";let m=G.filter(a=>{const b=!o||(a.email||"").toLowerCase().includes(o)||(a.full_name||"").toLowerCase().includes(o),O=C.filter(y=>y.student_email?.toLowerCase()===a.email?.toLowerCase()&&y.status==="active").map(y=>y.course_id),se=l==="All"||O.includes(l);return b&&se});const d=G.length,r=C.filter(a=>a.status==="active"),u=r.reduce((a,b)=>a+(b.amount_inr||4999),0);if(e&&(e.textContent=d.toString()),t&&(t.textContent=r.length.toString()),s&&(s.textContent=`Est. Rev: ₹${u.toLocaleString("en-IN")}`),i&&(i.textContent=`${d} Active`),m.length===0){n.innerHTML=`
        <tr>
          <td colspan="5" class="py-8 text-center text-xs text-slate-500">
            No registered students found matching filter.
          </td>
        </tr>
      `;return}const p=new Map((W||[]).map(a=>[a.id,a.title]));n.innerHTML=m.map(a=>{const b=C.filter(y=>y.student_email?.toLowerCase()===a.email?.toLowerCase()),O=b.length>0?b.map(y=>{const Ie=p.get(y.course_id)||y.course_id;return`
              <span class="px-2 py-0.5 rounded text-[10px] font-bold ${y.status==="revoked"?"bg-red-100 text-red-700 border border-red-200 line-through":"bg-emerald-100 text-emerald-800 border border-emerald-200"}">
                ${Ie.split("Masterclass")[0].split("Bootcamp")[0].trim()} (${y.status})
              </span>
            `}).join(" "):'<span class="text-slate-400 font-mono text-[11px]">No active enrollments</span>';return`
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-3 px-4">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-full bg-[#112649] text-white flex items-center justify-center font-bold text-xs shrink-0">
                ${(a.full_name||a.email||"S").charAt(0).toUpperCase()}
              </div>
              <div>
                <div class="font-bold text-slate-900">${a.full_name||"Student Account"}</div>
                <div class="text-[11px] text-slate-500 font-mono">${a.email}</div>
              </div>
            </div>
          </td>
          <td class="py-3 px-4">
            <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${a.role==="admin"?"bg-purple-100 text-purple-800 border border-purple-300":"bg-slate-100 text-slate-700"}">
              ${(a.role||"student").toUpperCase()}
            </span>
          </td>
          <td class="py-3 px-4">
            <div class="flex flex-wrap gap-1">
              ${O}
            </div>
          </td>
          <td class="py-3 px-4 font-mono text-slate-500 text-[11px]">
            ${(a.created_at||"").split("T")[0]||"2026-09-01"}
          </td>
          <td class="py-3 px-4 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button 
                type="button" 
                onclick="window.quickEnroll('${a.email}', '${a.full_name||""}')"
                class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#16A34A] hover:bg-[#15803D] text-white shadow-xs cursor-pointer"
                title="Grant course access"
              >
                + Enroll
              </button>
              <a 
                href="mailto:${a.email}?subject=RKMIDIGILABS Academy Access" 
                class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                title="Send email"
              >
                Email
              </a>
            </div>
          </td>
        </tr>
      `}).join("")}document.getElementById("student-search-input")?.addEventListener("input",ne);document.getElementById("student-course-filter")?.addEventListener("change",ne);document.getElementById("refresh-students-btn")?.addEventListener("click",N);const j=document.getElementById("enroll-student-modal"),nt=document.getElementById("enroll-student-form"),st=document.getElementById("open-enroll-modal-btn"),ot=document.getElementById("close-enroll-modal-btn"),it=document.getElementById("cancel-enroll-modal-btn");function Ee(n="",e=""){document.getElementById("enroll-email").value=n,document.getElementById("enroll-name").value=e,document.getElementById("enroll-payment-ref").value="MANUAL-UPI-"+Date.now().toString().slice(-6),j?.classList.remove("hidden")}window.quickEnroll=Ee;st?.addEventListener("click",()=>Ee());ot?.addEventListener("click",()=>j?.classList.add("hidden"));it?.addEventListener("click",()=>j?.classList.add("hidden"));nt?.addEventListener("submit",async n=>{n.preventDefault();const e=document.getElementById("enroll-email").value.trim(),t=document.getElementById("enroll-name").value.trim(),s=document.getElementById("enroll-course-select").value,i=document.getElementById("enroll-payment-ref").value.trim();if(!e||!s)return;const o=document.getElementById("submit-enroll-btn");o&&(o.setAttribute("disabled","true"),o.textContent="Activating...");try{await Be(e,s,i,t||"Student"),j?.classList.add("hidden"),c(`Access granted to ${e} for course!`),await N()}catch(l){c(l.message||"Failed to grant enrollment",!0)}finally{o&&(o.removeAttribute("disabled"),o.textContent="Activate Access")}});Z();Pe();ee().then(()=>D());N();
