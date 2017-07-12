const Plugin = module.parent.require('../Structures/Plugin');
global.jQuery = require("jquery");
require("jquery-ui");
const request = require("request");
const $ = global.jQuery;


class DCards extends Plugin {
    constructor(...args) {
        super(...args);
        // Create all elements
        this.div = document.createElement("div");
        this.div.id = "DCards-Div"
        this.div.innerHTML = `
<div class="DCards-ButtonBar">
  <button class="DCards-Button" onclick="openTab('profile')">Profile</button>
  <button class="DCards-Button" onclick="openTab('inv')">Inventory</button>
  <button class="DCards-Button" onclick="openTab('market')">Market</button>
  <button class="DCards-Button" onclick="openTab('quest')">Quest</button>
</div>

<div id="profile" class="DCards-Tab">
</div>

<div id="inv" class="DCards-Tab" style="display:none">
</div>

<div id="market" class="DCards-Tab" style="display:none">
</div>

<div id="quest" class="DCards-Tab" style="display:none">
</div>

<script>
function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("DCards-Tab");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}
</script>`;



        this.log("DCards Elements created!");

        document.body.appendChild(this.div);

        $(function() {
            $("#DCards-Div").draggable();
        });
        this.user = {
            id: DI.client.user.id,
            badges: {},
            inv: {},
            balance: 0,
            quest: {},
            clubs: [],
            offers: []
            daily: {next: 0,
                    streak: 0}
        }
        this.market = []
    }

    loadData(){
        request("https://api.discord.cards/user/${this.user.id}", (er,, res, body){
            data = JSON.parse(body);
            this.user.badges = data.badges;
            this.user.inv = data.inv;
            this.user.balance = data.money;
            this.user.quest = data.quest;
            this.user.daily = {streak: data.daily.streak,
                               next: new Date(data.daily.time + 3600*24*1000)};
        });

        request("https://api.discord.cards/user/${this.user.id}/clubs", (e, r, b){
            this.user.clubs = JSON.parse(b);
        }

        request("https://api.discord.cards/user/${this.user.id}/offers", (e, r, b){
            this.user.offers = JSON.parse(b);
        }

        request("https://api.discord.cards/list/offers", (e, r, b){
            this.market = JSON.parse(b);
        }
        this.reloadData();
    }

    reloadData(){
        $("#profile").innerHTML = `
<table>
    <tr>
        <th>Balance</th>
        <th>Inventory</th>
    </tr>
    <tr>
        <td>${this.user.balance}</td>
        <td>${Object.values(this.user.inv).reduce((r,e)=>r+e)} items</td>
    </tr>
</table>
<table>
    <tr>
        <th span=${this.user.badges.length}>
            Badges
        </th>
    </tr>
    <tr>
    </tr>
</table>`;
    }

    unload(){

    }
};

module.exports = DCards;
