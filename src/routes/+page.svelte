<script>
	let { data } = $props();
	import { useI18n } from '$lib/i18n-context.js';
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Services from '$lib/components/Services.svelte';
	import Products from '$lib/components/Products.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Footer from '$lib/components/Footer.svelte';
	const i18n = useI18n();
</script>

<svelte:head>
	<title>{i18n.t.meta.title}</title>
	<meta name="description" content={i18n.t.meta.description} />
	<meta property="og:title" content={i18n.t.meta.title} />
	<meta property="og:description" content={i18n.t.meta.description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://pi-retail.com/og.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<Nav />
<main>
	<Hero />
	<About />
	<Services />
	<Products />
	<Projects />
	<Contact token={data.formToken} />
</main>
<Footer />
