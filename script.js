(function () {
    'use strict';
    var nav = document.querySelector('body > nav');
    var sections = Array.prototype.slice.call(document.querySelectorAll('body > section'));

    window.addEventListener('hashchange', setSelectedLink);
    window.addEventListener('scroll', setHashFromScroll);

    if (!window.location.hash) {
        setHashFromScroll();
    }
    setSelectedLink();

    function setSelectedLink() {
        var selected = nav.querySelector('a.selected');
        if (selected) {
            selected.classList.remove('selected');
        }

        nav.querySelector('a[href="' + window.location.hash + '"]').classList.add('selected');
    }

    function setHashFromScroll() {
        var bodyScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var minDifference = +Infinity;
        var minSectionId;

        sections.forEach(function (section) {
            var difference = Math.abs(section.offsetTop - bodyScrollTop);
            if (difference < minDifference) {
                minDifference = difference;
                minSectionId = section.id;
            }
        });

        // Don't scroll the user when setting the hash; it's more for link-sharing purposes.
        window.location.hash = minSectionId;
        document.body.scrollTop = document.documentElement.scrollTop = bodyScrollTop;
    }
}());
