class Item {
	constructor(id, initialType) {
		this.id = id;
		this.type = initialType;
		this.connectDrag();
	}

	// make the item droppable
	connectDrag() {
		const item = document.getElementById(this.id);
		item.addEventListener('dragstart', (e) => {
			e.dataTransfer.clearData();
			e.dataTransfer.setData('text/plain', this.id);
			// which kind of drag operation should be allowed
			e.dataTransfer.effectAllowed = 'move';
		});
	}
}

class ItemList {
	constructor(id) {
		this.id = id;
		this.items = [];
		this.listDOM = document.querySelector(this.id);
		const itemList = document.querySelectorAll(`${id} li`);
		for (const li of itemList) {
			this.items.push(new Item(li.id, id));
		}
		this.connectDroppable();
	}

	// allow list to accept dropped items
	connectDroppable() {
		this.listDOM.addEventListener('dragenter', (e) => {
			// This is the type of data we set at the dragstart event.
			// Selecting the id is unfortunately not possible.
			if (e.dataTransfer.types[0] === 'text/plain') {
				e.preventDefault(); // default would be 'nothing can be dropped here'.
				// adds a distinctive background colour to the area.
				this.listDOM.classList.add('droppable');
			}
		});
		this.listDOM.addEventListener('dragover', (e) => {
			if (e.dataTransfer.types[0] === 'text/plain') {
				e.preventDefault();
			}
		});
		this.listDOM.addEventListener('dragleave', (e) => {
			// The 'dragleave event also fires when the cursor is over a child item
			// (another vegetable).  We want to include the child items, so we check
			// if our item is over any children of our list area.
			if (e.relatedTarget.closest(`${this.id}`) !== this.listDOM) {
				this.listDOM.classList.remove('droppable');
			}
		});
		this.listDOM.addEventListener('drop', (e) => {
			const itemId = e.dataTransfer.getData('text/plain');
			// Only allow to drop the item if it's not already there.
			const itemLi = document.getElementById(itemId);
			const alreadyThere = this.items.find((item) => item.id === itemId);

			if (!alreadyThere) {
				ItemList.moveItem(itemLi, this.id);
			}
		});
	}

	add = (el) => {
		this.items.push(el);
		const li = document.getElementById(el.id);
		const ul = document.querySelector(this.id);
		ul.appendChild(li);
	};

	delete = (el) => {
		const index = this.items.indexOf(el);
		this.items.splice(index, 1);
	};

	static moveItem(itemLi, toListId) {
		const newType = toListId;
		const fromList = toListId === '#shelf' ? App.basketList : App.shelfList;
		const toList = fromList === App.shelfList ? App.basketList : App.shelfList;
		const item = fromList.items.find((el) => el.id === itemLi.id);
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
