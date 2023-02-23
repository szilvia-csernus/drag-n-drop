class Tooltip {

}

class Item {
    constructor(id, initialType) {
        this.id = id;
        this.connectMoveButton();
        this.type = initialType;
    }

    connectMoveButton() {
        const item = document.getElementById(this.id);
        const moveBtn = item.querySelector('button');
        moveBtn.addEventListener('click', () => ItemList.moveItem(this, this.type))
    }
}

class ItemList {
	constructor(id) {
		this.id = id;
		this.items = new Set();
		const listItems = document.querySelectorAll(`${id} li`);
		for (const listItem of listItems) {
			this.items.add(new Item(listItem.id, id));
		}
	}

    add = (el) => {
			this.items.add(el);
            const li = document.getElementById(el.id);
            const ul = document.querySelector(this.id);
            console.log(this.id)
            console.log(li, ul)
            ul.appendChild(li);
		};

	delete = (el) => {
			this.items.delete(el);
            const li = document.getElementById(el.id);
		};

	static moveItem(item, from) {
		const newType = from === '#shelf' ? '#basket' : '#shelf';
		const toList = from === '#shelf' ? App.basketList : App.shelfList;
		const fromList = toList === App.shelfList ? App.basketList : App.shelfList;
		item.type = newType;
		toList.add(item);
		fromList.delete(item);
	}
}    

class App {
    static init() {
        this.shelfList = new ItemList('#shelf');
        this.basketList = new ItemList('#basket');
    }    
}


App.init();