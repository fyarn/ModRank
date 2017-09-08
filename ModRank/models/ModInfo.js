function ModInfo(title, id, title, num_comments_public, subscriptions, favorited,
    views, unsubscribes, preview_url, favsRank, favsPercent, subsRank, subsPercent,
    unsubscribesRank, unsubscribesPercent, viewsRank, viewsPercent, commentsRank, commentsPercent) {
    this.title = 'ModRank - ' + id;
    this.id = id;
    var itemTitle = title;
    var comments = num_comments_public;
    var subs = subscriptions;
    var favs = favorited;
    this.views = views;
    this.unsubscribes = unsubscribes;
    var img = preview_url;
    this.favsRank = favsRank;
    this.favsPercent = Math.round(favsPercent);
    this.subsRank = subsRank;
    this.subsPercent = Math.round(subsPercent);
    this.unsubscribesRank = unsubscribesRank;
    this.unsubscribesPercent = Math.round(unsubscribesPercent);
    this.viewsRank = viewsRank;
    this.viewsPercent = Math.round(viewsPercent);
    this.commentsRank = commentsRank;
    this.commentsPercent = Math.round(commentsPercent);
}

module.exports = ModInfo;