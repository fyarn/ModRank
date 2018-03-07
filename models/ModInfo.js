function ModInfo(id, title, num_comments_public, subscriptions, favorited,
    views, unsubscribes, preview_url, favsRank, favsPercent, subsRank, subsPercent,
    unsubscribesRank, unsubscribesPercent, viewsRank, viewsPercent, commentsRank, commentsPercent) {
    this.title = 'ModRank - ' + id;
    this.id = id;
    this.itemTitle = title;
    this.comments = num_comments_public;
    this.subs = subscriptions;
    this.favs = favorited;
    this.views = views;
    this.unsubscribes = unsubscribes;
    this.img = preview_url;
    this.favsRank = favsRank;
    this.favsPercent = favsPercent;
    this.subsRank = subsRank;
    this.subsPercent = subsPercent;
    this.unsubscribesRank = unsubscribesRank;
    this.unsubscribesPercent = unsubscribesPercent;
    this.viewsRank = viewsRank;
    this.viewsPercent = viewsPercent;
    this.commentsRank = commentsRank;
    this.commentsPercent = commentsPercent;
}

module.exports = ModInfo;