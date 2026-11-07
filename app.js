(() => {
  const grid = document.getElementById("product-grid");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();
  if (!grid) return;

  const wa = "https://wa.me/923234842963";

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  }[c]));

  let products = [];
  let filter = "All";

  function render() {
    const shown = products.filter(p =>
      filter === "All" || p.category === filter
    );

    if (!shown.length) {
      grid.innerHTML = '<div class="empty">Abhi products add nahi kiye gaye. WhatsApp par rabta karein.</div>';
      return;
    }

    grid.innerHTML = shown.map(p => {
      const msg = encodeURIComponent(
        "Assalam-o-Alaikum, mujhe " + p.name + " ke bare mein maloomat chahiye."
      );

      return '<article class="product-card">' +
        '<div class="product-image">' +
        (p.image_url
          ? '<img src="' + esc(p.image_url) + '" alt="' + esc(p.name) + '" loading="lazy">'
          : '<div class="image-placeholder">🚪 AHMAD DOORS</div>') +
        '</div><div class="product-info">' +
        '<span class="product-category">' + esc(p.category) + '</span>' +
        '<h3>' + esc(p.name) + '</h3>' +
        '<p>' + esc(p.description || "Mazeed maloomat ke liye rabta karein.") + '</p>' +
        '<div class="product-bottom"><strong class="price">' +
        esc(p.price || "Price on request") +
        '</strong><a class="order-small" href="' + wa + '?text=' + msg +
        '" target="_blank" rel="noopener">WhatsApp Order ↗</a></div></div></article>';
    }).join("");
  }

  document.querySelectorAll("[data-filter]").forEach(el => {
    el.addEventListener("click", () => {
      filter = el.dataset.filter || "All";
      document.querySelectorAll(".filter").forEach(b =>
        b.classList.toggle("active", b.dataset.filter === filter)
      );
      render();
    });
  });

  async function load() {
    if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY || !window.supabase) {
      grid.innerHTML = '<div class="empty">Website setup error. WhatsApp par rabta karein.</div>';
      return;
    }

    try {
      const client = window.supabase.createClient(
        window.SUPABASE_URL,
        window.SUPABASE_ANON_KEY
      );

      client.rpc("record_site_visit").then(({ error }) => {
        if (error) console.error("Visit count error:", error);
      });

      const { data, error } = await client
        .from("products")
        .select("id,name,category,price,description,image_url,active,created_at")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      products = data || [];
      render();

    } catch (e) {
      grid.innerHTML = '<div class="empty">Products load nahi ho sake. WhatsApp par rabta karein.</div>';
      console.error(e);
    }
  }

  load();
})();
