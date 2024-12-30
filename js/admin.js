// 填充导航项数据
function populateNavItems(navItems) {
    const tbody = document.getElementById("nav-items-table");
    tbody.innerHTML = ''; // 清除现有的行
    navItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" class="form-control" value="${item.name}" id="nav-item-name-${index}"></td>
            <td><input type="text" class="form-control" value="${item.url}" id="nav-item-url-${index}"></td>
            <td><button class="btn btn-danger btn-sm" onclick="removeNavItem(${index})">删除</button></td>
        `;
        tbody.appendChild(row);
    });
}

// 填充搜索引擎数据
function populateSearchEngines(searchEngines) {
    const tbody = document.getElementById("search-engines-table");
    tbody.innerHTML = ''; // 清除现有的行
    searchEngines.forEach((engine, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" class="form-control" value="${engine.name}" id="search-engine-name-${index}"></td>
            <td><input type="text" class="form-control" value="${engine.url}" id="search-engine-url-${index}"></td>
            <td><button class="btn btn-danger btn-sm" onclick="removeSearchEngine(${index})">删除</button></td>
        `;
        tbody.appendChild(row);
    });
}

// 填充分类数据
function populateCategories(categories) {
    const table = document.getElementById("categories-table");
    while (table.rows.length > 1) {
        table.deleteRow(1); // 清除现有的分类行（保留表头）
    }
    
    categories.forEach((category, categoryIndex) => {
        const row = table.insertRow();
        row.innerHTML = `
            <td><input type="text" value="${category.title}" id="category-title-${categoryIndex}"></td>
            <td><button onclick="removeCategory(${categoryIndex})">删除分类</button></td>
        `;

        const linksDiv = document.createElement('div');
        linksDiv.id = `category-links-${categoryIndex}`;
        row.appendChild(linksDiv);
        populateLinks(category.links, categoryIndex);
    });
}

// 填充每个分类的链接
function populateLinks(links, categoryIndex) {
    const linksDiv = document.getElementById(`category-links-${categoryIndex}`);
    linksDiv.innerHTML = '';
    linksDiv.className = 'mt-3 p-3 bg-light rounded';

    links.forEach((link, linkIndex) => {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'row g-3 mb-2';
        linkDiv.innerHTML = `
            <div class="col-md-3">
                <input type="text" class="form-control" value="${link.name}" id="link-name-${categoryIndex}-${linkIndex}" placeholder="名称">
            </div>
            <div class="col-md-4">
                <input type="text" class="form-control" value="${link.url}" id="link-url-${categoryIndex}-${linkIndex}" placeholder="链接">
            </div>
            <div class="col-md-4">
                <input type="text" class="form-control" value="${link.icon}" id="link-icon-${categoryIndex}-${linkIndex}" placeholder="图标">
            </div>
            <div class="col-md-1">
                <button class="btn btn-danger btn-sm w-100" onclick="removeLink(${categoryIndex}, ${linkIndex})">删除</button>
            </div>
        `;
        linksDiv.appendChild(linkDiv);
    });

    const addLinkButton = document.createElement('button');
    addLinkButton.textContent = '添加新链接';
    addLinkButton.className = 'btn btn-primary mt-2';
    addLinkButton.onclick = () => addLink(categoryIndex);
    linksDiv.appendChild(addLinkButton);
}

// 添加链接
function addLink(categoryIndex) {
    const newLink = { name: '', url: '', icon: '' };
    configData.links.categories[categoryIndex].links.push(newLink);
    populateLinks(configData.links.categories[categoryIndex].links, categoryIndex);
}

// 删除链接
function removeLink(categoryIndex, linkIndex) {
    configData.links.categories[categoryIndex].links.splice(linkIndex, 1);
    populateLinks(configData.links.categories[categoryIndex].links, categoryIndex);
}

// 删除分类
function removeCategory(categoryIndex) {
    configData.links.categories.splice(categoryIndex, 1);
    populateCategories(configData.links.categories);
}

// 删除导航项
function removeNavItem(index) {
    configData.links.navItems.splice(index, 1);
    populateNavItems(configData.links.navItems);
}

// 删除搜索引擎
function removeSearchEngine(index) {
    configData.links.searchEngines.splice(index, 1);
    populateSearchEngines(configData.links.searchEngines);
}

// 保存配置
async function saveConfig() {
    try {
        const response = await fetch('/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(configData)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        console.log('配置保存成功:', await response.text());
    } catch (error) {
        console.error('保存配置失败:', error);
        throw error;
    }
}

// 添加导航项
function addNavItem() {
    const name = document.getElementById("new-nav-item-name").value;
    const url = document.getElementById("new-nav-item-url").value;

    if (name && url) {
        const newItem = { name, url };
        configData.links.navItems.push(newItem);
        populateNavItems(configData.links.navItems);
        document.getElementById("new-nav-item-name").value = '';
        document.getElementById("new-nav-item-url").value = '';
    } else {
        alert("请填写名称和链接");
    }
}

// 添加搜索引擎
function addSearchEngine() {
    const name = document.getElementById("new-search-engine-name").value;
    const url = document.getElementById("new-search-engine-url").value;

    if (name && url) {
        const newEngine = { name, url };
        configData.links.searchEngines.push(newEngine);
        populateSearchEngines(configData.links.searchEngines);
        document.getElementById("new-search-engine-name").value = '';
        document.getElementById("new-search-engine-url").value = '';
    } else {
        alert("请填写名称和链接");
    }
}

// 添加新分类
function addCategory() {
    const title = document.getElementById("new-category-title").value;
    
    if (title) {
        const newCategory = { title, links: [] };
        configData.links.categories.push(newCategory);
        document.getElementById("new-category-title").value = '';
        populateCategories(configData.links.categories);
    } else {
        alert("请填写分类名称");
    }
}

// 切换显示/隐藏链接
function toggleLinks(categoryIndex) {
    const linksDiv = document.getElementById(`category-links-${categoryIndex}`);
    linksDiv.style.display = linksDiv.style.display === 'none' ? 'block' : 'none';
}

// 添加新链接的函数
function addNewLink(categoryIndex) {
    document.getElementById('linkName').value = '';
    document.getElementById('linkUrl').value = '';
    document.getElementById('linkIcon').value = '';
    document.getElementById('addLinkCategoryIndex').value = categoryIndex;
    $('#addLinkModal').modal('show');
}

// 保存新链接
async function saveNewLink() {
    try {
        const categoryIndex = parseInt(document.getElementById('addLinkCategoryIndex').value);
        const name = document.getElementById('linkName').value;
        const url = document.getElementById('linkUrl').value;
        const icon = document.getElementById('linkIcon').value;

        if (!name || !url) throw new Error('请填写名称和链接地址');

        const newLink = { name, url, icon: icon || '#icon-link' };
        configData.links.categories[categoryIndex].links.push(newLink);
        await saveConfig();
        $('#addLinkModal').modal('hide');
        await loadConfig();
    } catch (error) {
        console.error('保存链接失败:', error);
        alert(error.message || '保存失败，请重试');
    }
}

// 显示链接详情
function showLinkDetails(categoryIndex, link) {
    document.getElementById('linkDetailsCategoryIndex').value = categoryIndex;
    document.getElementById('linkDetailsName').value = link.name || '';
    document.getElementById('linkDetailsUrl').value = link.url || '';
    document.getElementById('linkDetailsIcon').value = link.icon || '';

    const linkIndex = configData.links.categories[categoryIndex].links.findIndex(l => 
        l.name === link.name && l.url === link.url && l.icon === link.icon
    );
    document.getElementById('linkDetailsIndex').value = linkIndex;
    $('#linkDetailsModal').modal('show');
}

// 保存链接更改
async function saveCurrentLink() {
    try {
        const categoryIndex = parseInt(document.getElementById('linkDetailsCategoryIndex').value);
        const linkIndex = parseInt(document.getElementById('linkDetailsIndex').value);
        
        const updatedLink = {
            name: document.getElementById('linkDetailsName').value,
            url: document.getElementById('linkDetailsUrl').value,
            icon: document.getElementById('linkDetailsIcon').value
        };

        if (!updatedLink.name || !updatedLink.url) throw new Error('请填写名称和链接地址');

        configData.links.categories[categoryIndex].links[linkIndex] = updatedLink;
        await saveConfig();
        $('#linkDetailsModal').modal('hide');
        await loadConfig();
    } catch (error) {
        console.error('保存链接失败:', error);
        alert(error.message || '保存失败，请重试');
    }
}

// 删除当前链接
async function deleteCurrentLink() {
    if (!confirm('确定要删除这个链接吗？')) return;

    try {
        const categoryIndex = parseInt(document.getElementById('linkDetailsCategoryIndex').value);
        const linkIndex = parseInt(document.getElementById('linkDetailsIndex').value);

        configData.links.categories[categoryIndex].links.splice(linkIndex, 1);
        await saveConfig();
        $('#linkDetailsModal').modal('hide');
        await loadConfig();
    } catch (error) {
        console.error('删除链接失败:', error);
        alert('删除失败，请重试');
    }
}

// 显示搜索引擎详情
function showEngineDetails(index, engine) {
    document.getElementById('engineDetailsIndex').value = index;
    document.getElementById('engineDetailsName').value = engine.name;
    document.getElementById('engineDetailsUrl').value = engine.url;
    document.getElementById('engineDetailsIcon').value = engine.icon;
    document.getElementById('engineDetailsPlaceholder').value = engine.placeholder || '';
    $('#engineDetailsModal').modal('show');
}

// 保存搜索引擎更改
async function saveCurrentEngine() {
    try {
        const index = document.getElementById('engineDetailsIndex').value;
        const name = document.getElementById('engineDetailsName').value;
        const url = document.getElementById('engineDetailsUrl').value;
        const icon = document.getElementById('engineDetailsIcon').value;
        const placeholder = document.getElementById('engineDetailsPlaceholder').value;

        if (!name || !url || !icon) throw new Error('请填写必填项');

        configData.links.searchEngines[index] = { name, url, icon, placeholder: placeholder || `${name}搜索` };
        await saveConfig();
        $('#engineDetailsModal').modal('hide');
        await loadConfig();
    } catch (error) {
        alert(error.message || '保存失败');
    }
}

// 删除当前搜索引擎
async function deleteCurrentEngine() {
    if (!confirm('确定要删除这个搜索引擎吗？')) return;
    
    try {
        const index = document.getElementById('engineDetailsIndex').value;
        configData.links.searchEngines.splice(index, 1);
        await saveConfig();
        $('#engineDetailsModal').modal('hide');
        await loadConfig();
    } catch (error) {
        alert('删除失败');
    }
}

// 显示导航项详情
function showNavDetails(index, item) {
    document.getElementById('navDetailsIndex').value = index;
    document.getElementById('navDetailsName').value = item.name;
    document.getElementById('navDetailsUrl').value = item.url;
    document.getElementById('navDetailsId').value = item.id || '';
    $('#navDetailsModal').modal('show');
}

// 保存导航项更改
async function saveCurrentNav() {
    try {
        const index = document.getElementById('navDetailsIndex').value;
        const name = document.getElementById('navDetailsName').value;
        const url = document.getElementById('navDetailsUrl').value;
        const id = document.getElementById('navDetailsId').value;

        if (!name || !url) throw new Error('请填写必填项');

        configData.links.navItems[index] = { name, url, id: id || name };
        await saveConfig();
        $('#navDetailsModal').modal('hide');
        await loadConfig();
    } catch (error) {
        alert(error.message || '保存失败');
    }
}

// 删除当前导航项
async function deleteCurrentNav() {
    if (!confirm('确定要删除这个导航项吗？')) return;
    
    try {
        const index = document.getElementById('navDetailsIndex').value;
        configData.links.navItems.splice(index, 1);
        await saveConfig();
        $('#navDetailsModal').modal('hide');
        await loadConfig();
    } catch (error) {
        alert('删除失败');
    }
}

// 显示分类详情
function showCategoryDetails(index, category) {
    document.getElementById('categoryDetailsIndex').value = index;
    document.getElementById('categoryDetailsTitle').value = category.title;
    document.getElementById('categoryDetailsIcon').value = category.icon;
    $('#categoryDetailsModal').modal('show');
}

// 保存分类更改
async function saveCurrentCategory() {
    try {
        const index = document.getElementById('categoryDetailsIndex').value;
        const title = document.getElementById('categoryDetailsTitle').value;
        const icon = document.getElementById('categoryDetailsIcon').value;

        if (!title || !icon) throw new Error('请填写所有必填项');

        const links = configData.links.categories[index].links;
        configData.links.categories[index] = { title, icon, links };
        await saveConfig();
        $('#categoryDetailsModal').modal('hide');
        await loadConfig();
    } catch (error) {
        console.error('操作失败:', error);
        alert(error.message || '保存失败');
    }
}

// 删除当前分类
async function deleteCurrentCategory() {
    if (!confirm('确定要删除这个分类吗？这将同时删除该分类下的所有链接！')) return;
    
    try {
        const index = document.getElementById('categoryDetailsIndex').value;
        configData.links.categories.splice(index, 1);
        await saveConfig();
        $('#categoryDetailsModal').modal('hide');
        await loadConfig();
    } catch (error) {
        console.error('操作失败:', error);
        alert('删除失败');
    }
}

// 显示版权设置
function showCopyrightDetails(event) {
    event.preventDefault();
    event.stopPropagation();

    document.getElementById('showCopyright').checked = configData.copyright.show !== false;
    document.getElementById('copyrightText').value = configData.copyright.text || '';
    document.getElementById('copyrightTarget').value = configData.copyright.target || '';
    document.getElementById('showRecord').checked = configData.copyright.showRecord !== false;
    document.getElementById('copyrightRecord').value = configData.copyright.record || '';
    document.getElementById('copyrightRecordUrl').value = configData.copyright.recordUrl || '';

    toggleCopyrightFields();
    toggleRecordFields();
    $('#copyrightModal').modal('show');
}

// 切换版权字段显示状态
function toggleCopyrightFields() {
    const showCopyright = document.getElementById('showCopyright').checked;
    document.getElementById('copyrightFields').style.display = showCopyright ? 'block' : 'none';
}

// 切换备案字段显示状态
function toggleRecordFields() {
    const showRecord = document.getElementById('showRecord').checked;
    document.getElementById('recordFields').style.display = showRecord ? 'block' : 'none';
}

// 保存版权设置
async function saveCopyrightSettings() {
    try {
        const showCopyright = document.getElementById('showCopyright').checked;
        const showRecord = document.getElementById('showRecord').checked;

        configData.copyright = {
            show: showCopyright,
            text: document.getElementById('copyrightText').value,
            target: document.getElementById('copyrightTarget').value,
            showRecord: showRecord,
            record: document.getElementById('copyrightRecord').value,
            recordUrl: document.getElementById('copyrightRecordUrl').value
        };

        await saveConfig();
        $('#copyrightModal').modal('hide');
        await loadConfig();
    } catch (error) {
        console.error('保存失败:', error);
        alert('保存失败，请重试');
    }
}

// 添加事件监听器
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('showCopyright').addEventListener('change', toggleCopyrightFields);
    document.getElementById('showRecord').addEventListener('change', toggleRecordFields);
});

// 初始化 Sortable
function initSortable() {
    const navList = document.getElementById('nav-items');
    if (navList) {
        new Sortable(navList, {
            animation: 150,
            handle: '.nav-link',
            filter: '.add-nav',
            onEnd: async function(evt) {
                try {
                    const items = [...configData.links.navItems];
                    const item = items.splice(evt.oldIndex, 1)[0];
                    items.splice(evt.newIndex, 0, item);
                    configData.links.navItems = items;
                    await saveConfig();
                } catch (error) {
                    console.error('保存排序失败:', error);
                    await loadConfig();
                }
            }
        });
    }

    const searchList = document.getElementById('chso');
    if (searchList) {
        new Sortable(searchList, {
            animation: 150,
            handle: 'label',
            filter: '.add-engine',
            onEnd: async function(evt) {
                try {
                    const items = [...configData.links.searchEngines];
                    const item = items.splice(evt.oldIndex, 1)[0];
                    items.splice(evt.newIndex, 0, item);
                    configData.links.searchEngines = items;
                    await saveConfig();
                } catch (error) {
                    console.error('保存排序失败:', error);
                    await loadConfig();
                }
            }
        });
    }

    const categoriesList = document.getElementById('categories');
    if (categoriesList) {
        new Sortable(categoriesList, {
            animation: 150,
            handle: '.title',
            filter: '.add-category',
            draggable: '.mylist:not(.add-category)',
            delay: 10,
            delayOnTouchOnly: true,
            onStart: function(evt) {
                evt.item.querySelector('.category-title').onclick = null;
            },
            onEnd: async function(evt) {
                try {
                    if (evt.oldIndex === evt.newIndex) {
                        const categoryIndex = evt.oldIndex;
                        const category = configData.links.categories[categoryIndex];
                        evt.item.querySelector('.category-title').onclick = () => 
                            showCategoryDetails(categoryIndex, category);
                        return;
                    }

                    const categories = [...configData.links.categories];
                    const category = categories.splice(evt.oldIndex, 1)[0];
                    categories.splice(evt.newIndex, 0, category);
                    configData.links.categories = categories;
                    await saveConfig();
                    await loadConfig();
                } catch (error) {
                    console.error('保存排序失败:', error);
                    alert('保存排序失败，即将重新加载页面');
                    await loadConfig();
                }
            }
        });
    }

    document.querySelectorAll('.mylist').forEach((list) => {
        if (!list.classList.contains('add-category')) {
            new Sortable(list, {
                animation: 150,
                handle: '.lylme-3',
                filter: '.add-link, .title',
                group: 'links',
                onEnd: async function(evt) {
                    try {
                        if (evt.oldIndex === evt.newIndex && evt.from === evt.to) return;

                        const fromTitle = evt.from.querySelector('.title span').textContent;
                        const toTitle = evt.to.querySelector('.title span').textContent;

                        const fromCategoryIndex = configData.links.categories.findIndex(c => c.title === fromTitle);
                        const toCategoryIndex = configData.links.categories.findIndex(c => c.title === toTitle);

                        if (fromCategoryIndex === -1 || toCategoryIndex === -1) {
                            throw new Error('找不到对应的分类');
                        }

                        const fromLinks = [...configData.links.categories[fromCategoryIndex].links];
                        const toLinks = fromCategoryIndex === toCategoryIndex ? 
                            fromLinks : 
                            [...configData.links.categories[toCategoryIndex].links];

                        const link = fromLinks.splice(evt.oldIndex - 1, 1)[0];
                        toLinks.splice(evt.newIndex - 1, 0, link);

                        configData.links.categories[fromCategoryIndex].links = fromLinks;
                        if (fromCategoryIndex !== toCategoryIndex) {
                            configData.links.categories[toCategoryIndex].links = toLinks;
                        }

                        await saveConfig();
                    } catch (error) {
                        console.error('保存排序失败:', error);
                        alert('保存排序失败，即将重新加载页面');
                        await loadConfig();
                    }
                }
            });
        }
    });
}

// 自动获取链接信息
async function autoFetchLinkInfo() {
    const isDetailsModal = $('#linkDetailsModal').is(':visible');
    const isAddModal = $('#addLinkModal').is(':visible');
    
    const urlInput = isDetailsModal ? 
        document.getElementById('linkDetailsUrl') : 
        document.getElementById('linkUrl');
    const nameInput = isDetailsModal ? 
        document.getElementById('linkDetailsName') : 
        document.getElementById('linkName');
    const iconInput = isDetailsModal ? 
        document.getElementById('linkDetailsIcon') : 
        document.getElementById('linkIcon');

    let url = urlInput.value.trim();
    
    if (!url) {
        alert('请先输入链接地址');
        return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
        urlInput.value = url;
    }

    const button = event.currentTarget;
    const originalContent = button.innerHTML;
    
    try {
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

        const response = await fetch(`/fetch-site-info?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
            if (url.startsWith('https://')) {
                url = 'http://' + url.substring(8);
                urlInput.value = url;
                const retryResponse = await fetch(`/fetch-site-info?url=${encodeURIComponent(url)}`);
                if (!retryResponse.ok) throw new Error('获取网站信息失败');
                const data = await retryResponse.json();
                if (data.title) nameInput.value = data.title;
                if (data.favicon) iconInput.value = data.favicon;
                return;
            }
            throw new Error('获取网站信息失败');
        }

        const data = await response.json();
        if (data.title) nameInput.value = data.title;
        if (data.favicon) iconInput.value = data.favicon;

    } catch (error) {
        console.error('获取链接信息失败:', error);
        alert('获取失败，请手动输入');
    } finally {
        button.disabled = false;
        button.innerHTML = originalContent;
    }
}

// 显示网站信息
function showSiteInfo() {
    document.getElementById('siteTitle').value = configData.title || '';
    document.getElementById('siteKeywords').value = configData.keywords || '';
    document.getElementById('siteDescription').value = configData.description || '';
    document.getElementById('siteAuthor').value = configData.author || '';
    document.getElementById('siteFavicon').value = configData.favicon || '';
    document.getElementById('siteBackground').value = configData.backgroundImage || '';
    $('#siteInfoModal').modal('show');
}

// 保存网站信息
async function saveSiteInfo() {
    try {
        configData.title = document.getElementById('siteTitle').value;
        configData.keywords = document.getElementById('siteKeywords').value;
        configData.description = document.getElementById('siteDescription').value;
        configData.author = document.getElementById('siteAuthor').value;
        configData.favicon = document.getElementById('siteFavicon').value;
        configData.backgroundImage = document.getElementById('siteBackground').value;

        await saveConfig();
        $('#siteInfoModal').modal('hide');
        await loadConfig();
    } catch (error) {
        console.error('保存网站信息失败:', error);
        alert('保存失败，请重试');
    }
}

// 添加新搜索引擎
function addNewEngine() {
    document.getElementById('engineName').value = '';
    document.getElementById('engineUrl').value = '';
    document.getElementById('engineIcon').value = '';
    document.getElementById('enginePlaceholder').value = '';
    $('#addEngineModal').modal('show');
    
    document.getElementById('saveEngine').onclick = async function() {
        try {
            const engineName = document.getElementById('engineName').value;
            const engineUrl = document.getElementById('engineUrl').value;
            const engineIcon = document.getElementById('engineIcon').value;
            const enginePlaceholder = document.getElementById('enginePlaceholder').value;
            
            if (!engineName || !engineUrl || !engineIcon) throw new Error('请填写必填项');

            const newEngine = { name: engineName, url: engineUrl, icon: engineIcon, placeholder: enginePlaceholder || `${engineName}搜索` };
            configData.links.searchEngines.push(newEngine);
            await saveConfig();
            $('#addEngineModal').modal('hide');
            await loadConfig();
        } catch (error) {
            console.error('操作失败:', error);
            alert(error.message || '添加搜索引擎失败，请重试');
        }
    };
}

// 添加新导航项
function addNewNavItem() {
    document.getElementById('navName').value = '';
    document.getElementById('navUrl').value = '';
    document.getElementById('navId').value = '';
    $('#addNavModal').modal('show');
    
    document.getElementById('saveNav').onclick = async function() {
        try {
            const navName = document.getElementById('navName').value;
            const navUrl = document.getElementById('navUrl').value;
            const navId = document.getElementById('navId').value;
            
            if (!navName || !navUrl) throw new Error('请填写必填项');

            const newNavItem = { name: navName, url: navUrl, id: navId || navName };
            configData.links.navItems.push(newNavItem);
            await saveConfig();
            $('#addNavModal').modal('hide');
            await loadConfig();
        } catch (error) {
            console.error('操作失败:', error);
            alert(error.message || '添加导航项失败，请重试');
        }
    };
}

// 添加新分类
function addNewCategory() {
    document.getElementById('newCategoryTitle').value = '';
    document.getElementById('newCategoryIcon').value = '';
    $('#addCategoryModal').modal('show');
}

// 保存新分类
async function saveNewCategory() {
    try {
        const title = document.getElementById('newCategoryTitle').value;
        const icon = document.getElementById('newCategoryIcon').value;

        if (!title || !icon) throw new Error('请填写所有必填项');

        const newCategory = { title, icon, links: [] };
        configData.links.categories.push(newCategory);
        await saveConfig();
        $('#addCategoryModal').modal('hide');
        await loadConfig();
    } catch (error) {
        console.error('操作失败:', error);
        alert(error.message || '添加分类失败，请重试');
    }
}
