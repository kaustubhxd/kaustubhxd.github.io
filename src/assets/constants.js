const X = {
    closeDotNormal      :   require('@/assets/buttons/close.png'),
    closeDotPrelight    :   require('@/assets/buttons/close_focused_prelight.png'),
    closeDotClicked     :   require('@/assets/buttons/close_focused_pressed.png'),

    minimizeDotNormal    :   require('@/assets/buttons/minimize.png'),
    minimizeDotPrelight  :   require('@/assets/buttons/minimize_focused_prelight.png'),
    minimizeDotClicked   :   require('@/assets/buttons/minimize_focused_pressed.png'),

    maximizeDotNormal    :   require('@/assets/buttons/maximize.png'),
    maximizeDotPrelight  :   require('@/assets/buttons/maximize_focused_prelight.png'),
    maximizeDotClicked   :   require('@/assets/buttons/maximize_focused_pressed.png'),
};

var K = {}
Object.entries(X).forEach(([name, imgFun]) => {
    K[name] = `url(${imgFun}`
});


export{
    K,
    X
}