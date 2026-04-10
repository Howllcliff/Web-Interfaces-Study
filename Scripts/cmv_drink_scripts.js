// Função pura isolada
const calculateSuggestedPriceMath = (totalCost, cmvPercentage) => {
    if (cmvPercentage <= 0) return 0;
    return totalCost / (cmvPercentage / 100);
};

if (typeof document !== 'undefined') {

    const spiritsContainer = document.getElementById('spirits-container');
    const ingredientsContainer = document.getElementById('ingredients-container');
    const savedContainer = document.getElementById('saved-drinks-container');
    
    let currentTotalCost = 0;
    let currentSuggestedPrice = 0;
    let editIndex = -1; // -1 significa que é um drink novo. Número >= 0 significa edição.

    const formatBRL = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    // INVENTÁRIO (Reutilização de bebidas)
    const updateInventoryDatalist = () => {
        const inventory = JSON.parse(localStorage.getItem('drinkInventory')) || {};
        const datalist = document.getElementById('inventory-list');
        datalist.innerHTML = '';
        for (const spiritName in inventory) {
            const option = document.createElement('option');
            option.value = spiritName;
            datalist.appendChild(option);
        }
    };

    // Auto-preencher dados se a bebida existir no inventário
    const handleSpiritNameChange = (event) => {
        const name = event.target.value.trim();
        const inventory = JSON.parse(localStorage.getItem('drinkInventory')) || {};
        
        if (inventory[name]) {
            const row = event.target.closest('.spirit-row');
            row.querySelector('.spirit-price').value = inventory[name].price;
            row.querySelector('.spirit-vol').value = inventory[name].volume;
            calculateAll();
        }
    };

    const addSpiritRow = (name = '', price = '', volume = '', dose = '') => {
        const div = document.createElement('div');
        div.className = 'item-row spirit-row';
        div.innerHTML = `
            <button class="btn-remove" onclick="this.parentElement.remove(); calculateAll();">Remover</button>
            <div class="form-group" style="margin-bottom: 0;">
                <label>Ingrediente</label>
                <input type="text" class="spirit-name" list="inventory-list" placeholder="Ex: Vodka, Gin..." value="${name}">
            </div>
            <div class="item-grid-3">
                <div>
                    <label>Garrafa (R$)</label>
                    <input type="number" class="calc-trigger spirit-price" placeholder="0.00" min="0" step="0.01" value="${price}">
                </div>
                <div>
                    <label>Vol. (ml)</label>
                    <input type="number" class="calc-trigger spirit-vol" placeholder="750" min="1" value="${volume}">
                </div>
                <div>
                    <label>Dose (ml)</label>
                    <input type="number" class="calc-trigger spirit-dose" placeholder="50" min="0" step="1" value="${dose}">
                </div>
            </div>
        `;
        
        // Adiciona evento para buscar no inventário ao digitar o nome
        div.querySelector('.spirit-name').addEventListener('input', handleSpiritNameChange);
        spiritsContainer.appendChild(div);
    };

    const addIngredientRow = (name = '', cost = '') => {
        const div = document.createElement('div');
        div.className = 'item-row ingredient-row';
        div.innerHTML = `
            <button class="btn-remove" onclick="this.parentElement.remove(); calculateAll();">Remover</button>
            <div class="item-grid-2">
                <div>
                    <label>Insumo Extra</label>
                    <input type="text" class="ingredient-name" placeholder="Descrição" value="${name}">
                </div>
                <div>
                    <label>Custo (R$)</label>
                    <input type="number" class="calc-trigger ingredient-cost" placeholder="0.00" min="0" step="0.01" value="${cost}">
                </div>
            </div>
        `;
        ingredientsContainer.appendChild(div);
    };

    window.calculateAll = () => {
        let totalLiquidCost = 0;
        let totalExtraCost = 0;

        document.querySelectorAll('.spirit-row').forEach(row => {
            const price = parseFloat(row.querySelector('.spirit-price').value) || 0;
            const volume = parseFloat(row.querySelector('.spirit-vol').value) || 0;
            const dose = parseFloat(row.querySelector('.spirit-dose').value) || 0;
            if (volume > 0) totalLiquidCost += (price / volume) * dose;
        });

        document.querySelectorAll('.ingredient-row').forEach(row => {
            const cost = parseFloat(row.querySelector('.ingredient-cost').value) || 0;
            totalExtraCost += cost;
        });

        currentTotalCost = totalLiquidCost + totalExtraCost;
        const cmv = parseFloat(document.getElementById('cmv-input').value) || 0;

        currentSuggestedPrice = calculateSuggestedPriceMath(currentTotalCost, cmv);

        document.getElementById('res-total-cost').textContent = formatBRL(currentTotalCost);
        document.getElementById('res-suggested-price').textContent = formatBRL(currentSuggestedPrice);
    };

    const loadSavedDrinks = () => {
        const drinks = JSON.parse(localStorage.getItem('savedDrinks')) || [];
        savedContainer.innerHTML = '';

        if (drinks.length === 0) {
            savedContainer.innerHTML = '<div class="empty-state">Nenhum drink salvo ainda. Clique em "+ Novo Drink".</div>';
            return;
        }

        drinks.forEach((drink, index) => {
            const div = document.createElement('div');
            div.className = 'saved-drink-item';
            div.innerHTML = `
                <div class="saved-drink-info">
                    <h4>${drink.name}</h4>
                    <p>Custo: <strong>${formatBRL(drink.cost)}</strong> | Venda sugerida: <strong>${formatBRL(drink.price)}</strong> (CMV: ${drink.cmv}%)</p>
                </div>
                <div class="drink-actions">
                    <button class="btn-edit-saved" onclick="editDrink(${index})">Editar</button>
                    <button class="btn-delete-saved" onclick="deleteDrink(${index})">Excluir</button>
                </div>
            `;
            savedContainer.appendChild(div);
        });
    };

    const saveDrink = () => {
        const nameInput = document.getElementById('drink-name');
        const drinkName = nameInput.value.trim();
        const cmv = document.getElementById('cmv-input').value;

        if (!drinkName) {
            alert("Por favor, digite o nome do drink antes de salvar!");
            return;
        }
        if (currentTotalCost === 0) {
            alert("Adicione insumos para calcular o custo antes de salvar!");
            return;
        }

        // Coleta os dados para poder editá-los futuramente
        const spiritsData = [];
        let inventory = JSON.parse(localStorage.getItem('drinkInventory')) || {};

        document.querySelectorAll('.spirit-row').forEach(row => {
            const name = row.querySelector('.spirit-name').value.trim();
            const price = row.querySelector('.spirit-price').value;
            const volume = row.querySelector('.spirit-vol').value;
            const dose = row.querySelector('.spirit-dose').value;
            
            if (name) {
                spiritsData.push({ name, price, volume, dose });
                // Salva ou atualiza a bebida no inventário para autocompletar da próxima vez
                if(price && volume) inventory[name] = { price, volume };
            }
        });
        localStorage.setItem('drinkInventory', JSON.stringify(inventory));
        updateInventoryDatalist(); // Atualiza o datalist

        const ingredientsData = [];
        document.querySelectorAll('.ingredient-row').forEach(row => {
            const name = row.querySelector('.ingredient-name').value.trim();
            const cost = row.querySelector('.ingredient-cost').value;
            if (name || cost) ingredientsData.push({ name, cost });
        });

        const newDrink = {
            name: drinkName,
            cost: currentTotalCost,
            price: currentSuggestedPrice,
            cmv: cmv,
            spirits: spiritsData,
            ingredients: ingredientsData,
            date: new Date().toISOString()
        };

        let drinks = JSON.parse(localStorage.getItem('savedDrinks')) || [];
        
        if (editIndex >= 0) {
            // Atualiza drink existente
            drinks[editIndex] = newDrink;
            alert(`Drink "${drinkName}" atualizado com sucesso!`);
        } else {
            // Adiciona novo
            drinks.push(newDrink);
            alert(`Drink "${drinkName}" salvo com sucesso!`);
        }

        localStorage.setItem('savedDrinks', JSON.stringify(drinks));
        
        // Fecha o modal via CSS (limpando o hash da URL)
        window.location.hash = ''; 
        loadSavedDrinks();
        clearForm();
    };

    // Prepara o modal para criar um NOVO drink
    window.prepareNewDrink = () => {
        editIndex = -1;
        document.getElementById('modal-title').innerText = "Cadastrar Novo Drink";
        clearForm();
    };

    // Limpa o formulário do modal
    window.clearForm = () => {
        document.getElementById('drink-name').value = '';
        document.getElementById('cmv-input').value = '25';
        spiritsContainer.innerHTML = '';
        ingredientsContainer.innerHTML = '';
        addSpiritRow();
        addIngredientRow();
        calculateAll();
    };

    // Abre o modal preenchido com os dados do drink para edição
    window.editDrink = (index) => {
        const drinks = JSON.parse(localStorage.getItem('savedDrinks')) || [];
        const drink = drinks[index];
        if (!drink) return;

        editIndex = index;
        document.getElementById('modal-title').innerText = `Editar Drink: ${drink.name}`;
        
        document.getElementById('drink-name').value = drink.name;
        document.getElementById('cmv-input').value = drink.cmv || 25;
        
        spiritsContainer.innerHTML = '';
        if (drink.spirits && drink.spirits.length > 0) {
            drink.spirits.forEach(s => addSpiritRow(s.name, s.price, s.volume, s.dose));
        } else {
            addSpiritRow();
        }

        ingredientsContainer.innerHTML = '';
        if (drink.ingredients && drink.ingredients.length > 0) {
            drink.ingredients.forEach(i => addIngredientRow(i.name, i.cost));
        } else {
            addIngredientRow();
        }

        calculateAll();
        // Abre o modal ativando o target no CSS
        window.location.hash = '#modal-cadastro';
    };

    window.deleteDrink = (index) => {
        if (confirm("Tem certeza que deseja excluir este drink?")) {
            let drinks = JSON.parse(localStorage.getItem('savedDrinks')) || [];
            drinks.splice(index, 1);
            localStorage.setItem('savedDrinks', JSON.stringify(drinks));
            loadSavedDrinks();
        }
    };

    // Event Listeners
    document.getElementById('btn-add-spirit').addEventListener('click', () => addSpiritRow());
    document.getElementById('btn-add-ingredient').addEventListener('click', () => addIngredientRow());
    document.getElementById('btn-save-drink').addEventListener('click', saveDrink);

    document.getElementById('calculator-form').addEventListener('input', (e) => {
        if (e.target.classList.contains('calc-trigger')) {
            calculateAll();
        }
    });

    // Inicialização
    updateInventoryDatalist();
    clearForm();
    loadSavedDrinks();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateSuggestedPriceMath };
}