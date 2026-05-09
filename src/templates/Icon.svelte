<script>
    let {icon, name, width = '32', height = '32'} = $props();
</script>

<div class="flex flex-col items-center">
    <img src={icon} alt={name} {width} {height} />
    <p class="text-neutral-50 text-shadow-black text-shadow-sm">{name}</p>
</div>