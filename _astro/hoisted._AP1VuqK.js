import{s as f}from"./supabase.B49gIuNd.js";import{c as h}from"./idb.C3fpF4UB.js";import"./YouTubeEmbed.astro_astro_type_script_index_0_lang.f2mNeyfd.js";import"./hoisted.BgEWZmo6.js";async function l(){const a={};try{const e=JSON.parse(localStorage.getItem("rkmidigi_custom_posts")||"[]");Array.isArray(e)&&e.forEach(t=>{t.slug&&(a[t.slug]=t)})}catch{}try{const e=await h();Array.isArray(e)&&e.forEach(t=>{t.slug&&(a[t.slug]={...a[t.slug]||{},...t})})}catch{}try{const e=f.from("posts").select("*"),t=new Promise(s=>setTimeout(s,2e3)),o=await Promise.race([e,t]);o&&Array.isArray(o.data)&&o.data.forEach(s=>{a[s.slug]={slug:s.slug,title:s.title,category:s.category,date:s.date,readTime:s.read_time,featured:s.featured,published:s.published,youtubeUrl:s.youtube_url,image:s.image,summary:s.summary,tags:Array.isArray(s.tags)?s.tags:[],body:s.body,author:s.author||"RKMIDIGILABS"}})}catch{}if(["localhost","127.0.0.1"].includes(window.location.hostname))try{const e=new AbortController,t=setTimeout(()=>e.abort(),1e3),o=await fetch(`http://localhost:4322/api/public/posts?_t=${Date.now()}`,{signal:e.signal});if(clearTimeout(t),o.ok){const s=await o.json();s.success&&Array.isArray(s.posts)&&s.posts.forEach(n=>{a[n.slug]=n})}}catch{}let i=[];try{i=JSON.parse(localStorage.getItem("rkmidigi_deleted_posts")||"[]")}catch{}let r={};try{r=JSON.parse(localStorage.getItem("rkmidigi_post_toggles")||"{}")}catch{}const c=document.getElementById("home-featured-section");if(c){const e=c.getAttribute("data-slug");if(e){let t=!0;typeof r[e]=="boolean"?t=r[e]:a[e]&&(t=a[e].published!==!1),i.includes(e)&&(t=!1),c.style.display=t?"":"none"}}const u=document.getElementById("home-recent-grid"),g=document.querySelectorAll(".home-recent-wrapper"),d=new Set;g.forEach(e=>{const t=e.getAttribute("data-slug");if(!t)return;if(d.add(t),i.includes(t)){e.remove();return}let o=!0;typeof r[t]=="boolean"?o=r[t]:a[t]&&(o=a[t].published!==!1),e.classList.toggle("hidden",!o),e.style.display=o?"":"none"}),Object.values(a).forEach(e=>{if(!e.slug||d.has(e.slug)||i.includes(e.slug))return;let t=e.published!==!1;if(typeof r[e.slug]=="boolean"&&(t=r[e.slug]),!!t&&u){d.add(e.slug);const o=document.createElement("div");o.className="home-recent-wrapper transition-all duration-200",o.setAttribute("data-slug",e.slug);const s=e.date?new Date(e.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"",n=(Array.isArray(e.tags)?e.tags:[]).slice(0,2).map(m=>`<span class="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">#${m}</span>`).join("");o.innerHTML=`
            <article class="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-400 shadow-sm hover:shadow-md transition-all duration-200 group">
              <a href="/blog/${e.slug}" class="relative aspect-video overflow-hidden bg-slate-100 block">
                ${e.image?`<img src="${e.image}" alt="${e.title}" class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />`:`
                  <div class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                    <svg class="w-12 h-12 stroke-current opacity-40" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                  </div>
                `}
                <div class="absolute top-3 left-3">
                  <span class="px-2.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-slate-100 text-slate-800 shadow-sm border border-slate-300">
                    ${e.category||"AI Governance"}
                  </span>
                </div>
                ${e.youtubeUrl?`
                  <div class="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600 text-white text-[11px] font-bold shadow-sm">
                    <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    <span>VIDEO</span>
                  </div>
                `:""}
              </a>
              <div class="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div class="flex items-center gap-2 text-xs text-slate-500 font-mono mb-2">
                    <time>${s}</time>
                    <span>•</span>
                    <span>${e.readTime||"4 min read"}</span>
                  </div>
                  <h3 class="text-base sm:text-lg font-black text-black group-hover:text-[#16A34A] transition-colors leading-snug line-clamp-2">
                    <a href="/blog/${e.slug}">${e.title}</a>
                  </h3>
                  <p class="mt-2 text-sm text-slate-700 line-clamp-2 leading-relaxed font-normal">${e.summary||""}</p>
                </div>
                <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div class="flex flex-wrap gap-1.5">${n}</div>
                  <a href="/blog/${e.slug}" class="text-xs font-bold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1">
                    Read Article
                    <svg class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </a>
                </div>
              </div>
            </article>
          `,u.prepend(o)}})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",l):l();try{const a=new BroadcastChannel("rkmidigi_blog_channel");a.onmessage=()=>{l()}}catch{}window.addEventListener("storage",a=>{(a.key==="rkmidigi_post_toggle"||a.key==="rkmidigi_post_update"||a.key==="rkmidigi_custom_posts")&&l()});window.addEventListener("focus",l);document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&l()});setInterval(l,3e3);
