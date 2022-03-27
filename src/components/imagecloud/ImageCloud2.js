import React, {Component} from 'react';
import * as d3 from "d3";
import {connect} from "react-redux";

class ImageCloud2 extends Component {

    constructor(props) {
        super(props);
        this.myReference = React.createRef();
    }

    componentDidMount() {
        this.update();
        var resizeId;

        const doneResizing =()=>this.update();

        window.addEventListener("resize",function() {
                        const containerWidth = document.getElementById("imageCloudContainer").offsetWidth
            if (containerWidth < 500) {
                clearTimeout(resizeId);
                resizeId = setTimeout(doneResizing, 500);
            }
        });
    }

    render() {
        return (
            <div>
                <div id="imageCloudContainer" style={{height: 440}}>
                    <h3>Image Cloud</h3>
                    <div id="imageCloudSvgContainer" style={{height: 440}} ref={this.myReference}></div>
                </div>
            </div>
        );
    }

    update(){

        const containerWidth = document.getElementById("imageCloudContainer").offsetWidth
        let svgWidth;
        let svgHeight = 400;
        let maxImages = 12
        let gpositionx
        let gpositiony
        let maxImageSize = 160
        let minImageSize = 65

        if (containerWidth < 500) {
            svgWidth = containerWidth
            //maxImages = 8
            gpositionx = svgWidth / 2
            gpositiony = svgHeight / 2.87
            maxImageSize = 120
            minImageSize = 55
        } else {
            svgWidth = 500
            maxImages = 12
            gpositionx = svgWidth / 2
            gpositiony = 148
        }

        const listenTo = Math.min(svgWidth, svgHeight);
        // create svg and g DOM elements;
        document.getElementById('imageCloudSvgContainer').innerHTML = "" //önceki içeriği siler
        let svg = d3.select(this.myReference.current)
            .append('svg')
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            // move 0,0 to the center
            .attr('transform', `translate(${gpositionx}, ${gpositiony})`);

        var images = [], maxWeight = 5, minWeight = 1, padding = 3;

        var getImages = this.props.currentImages;
        getImages.sort((a, b) => b.sayi - a.sayi);
        let centeredBiggestImage = false;
        let i = 0;
        getImages.map((image) => {
            let weight = (image.sayi)
            if (i < maxImages) {
                if (!centeredBiggestImage) {
                    images.push({
                        url: image.src,
                        weight,
                        fx: 0,
                        fy: 0,
                        alt: image.alt

                    })
                    centeredBiggestImage = true;
                    i++;
                } else {
                    images.push({
                        url: image.src,
                        weight,
                        alt: image.alt

                    });
                    i++
                }
            } else return false

        })

        images.sort((a, b) => b.weight - a.weight);

        // make it so the biggest images is equal to 10% of canvas, and thre smallest one 1%
        let scl = ((100 / maxImages) / 100);
        let miisp = 0.4;
        if (scl <= miisp) scl = scl / maxImages;

        // function to scale the images
        const scaleSize = d3.scaleLinear().domain([minWeight, maxWeight * 3]).range([minImageSize, maxImageSize]).clamp(true);

        // append the rects
        let vizImages = svg.selectAll('.image-cloud-image')
            .data(images)
            .enter()
            .append('svg:image')
            .attr('class', '.image-cloud-image')
            .attr('height', d => scaleSize(d.weight))
            .attr('width', d => scaleSize(d.weight))
            .attr('id', d => d.url)
            .attr('xlink:href', d => d.url);
        vizImages.exit().remove();

        // create the collection of forces
        const simulation = d3.forceSimulation()
            // set the nodes for the simulation to be our images
            .nodes(images)
            // set the function that will update the view on each 'tick'
            .on('tick', ticked)
            .force('center', d3.forceCenter())
            .force('cramp', d3.forceManyBody().strength(listenTo / 100))
            // collition force for rects
            .force('collide', rectCollide().size(d => {
                const s = scaleSize(d.weight);
                return [s + padding, s + padding];
            }));

        // update the position to new x and y
        function ticked() {
            vizImages.attr('x', d => d.x).attr('y', d => d.y);
        }

        function rectCollide() {
            var nodes, sizes, masses
            var size = constant([0, 0])
            var strength = 1
            var iterations = 1

            function force() {
                var node, size, mass, xi, yi
                var i = -1
                while (++i < iterations) {
                    iterate()
                }

                function iterate() {
                    var j = -1
                    var tree = d3.quadtree(nodes, xCenter, yCenter).visitAfter(prepare)

                    while (++j < nodes.length) {
                        node = nodes[j]
                        size = sizes[j]
                        mass = masses[j]
                        xi = xCenter(node)
                        yi = yCenter(node)

                        tree.visit(apply)
                    }
                }

                function apply(quad, x0, y0, x1, y1) {
                    var data = quad.data
                    var xSize = (size[0] + quad.size[0]) / 2
                    var ySize = (size[1] + quad.size[1]) / 2
                    if (data) {
                        if (data.index <= node.index) {
                            return
                        }

                        var x = xi - xCenter(data)
                        var y = yi - yCenter(data)
                        var xd = Math.abs(x) - xSize
                        var yd = Math.abs(y) - ySize

                        if (xd < 0 && yd < 0) {
                            var l = Math.sqrt(x * x + y * y)
                            var m = masses[data.index] / (mass + masses[data.index])

                            if (Math.abs(xd) < Math.abs(yd)) {
                                node.vx -= (x *= xd / l * strength) * m
                                data.vx += x * (1 - m)
                            } else {
                                node.vy -= (y *= yd / l * strength) * m
                                data.vy += y * (1 - m)
                            }
                        }
                    }

                    return x0 > xi + xSize || y0 > yi + ySize ||
                        x1 < xi - xSize || y1 < yi - ySize
                }

                function prepare(quad) {
                    if (quad.data) {
                        quad.size = sizes[quad.data.index]
                    } else {
                        quad.size = [0, 0]
                        var i = -1
                        while (++i < 4) {
                            if (quad[i] && quad[i].size) {
                                quad.size[0] = Math.max(quad.size[0], quad[i].size[0])
                                quad.size[1] = Math.max(quad.size[1], quad[i].size[1])
                            }
                        }
                    }
                }
            }

            function xCenter(d) {
                return d.x + d.vx + sizes[d.index][0] / 2
            }

            function yCenter(d) {
                return d.y + d.vy + sizes[d.index][1] / 2
            }

            force.initialize = function (_) {
                sizes = (nodes = _).map(size)
                masses = sizes.map(function (d) {
                    return d[0] * d[1]
                })
            }

            force.size = function (_) {
                return (arguments.length
                    ? (size = typeof _ === 'function' ? _ : constant(_), force)
                    : size)
            }

            force.strength = function (_) {
                return (arguments.length ? (strength = +_, force) : strength)
            }

            force.iterations = function (_) {
                return (arguments.length ? (iterations = +_, force) : iterations)
            }

            return force
        }

        function constant(_) {
            return function () {
                return _
            }
        }

    }

    zoom() {
        const zoomElem = document.getElementById("imageCloudContainer");
        zoomElem.style.transformOrigin = "0 0";
        let w = document.getElementsByTagName("body")[0].offsetWidth
        let cw = zoomElem.offsetWidth;
        let zoomCorrectionFactor = 0.95;

        if (w < cw) {
            this.zoom = w / cw;
            zoomElem.style.transform = "scale(" + this.zoom * zoomCorrectionFactor + ")";
        } else {
            this.zoom = 1;
            zoomElem.style.transform = "scale(" + this.zoom * zoomCorrectionFactor + ")";
        }

        window.addEventListener("resize", () => {

            let w = zoomElem.parentElement.offsetWidth
            let cw = zoomElem.offsetWidth;
            console.log(w + "-" + cw);
            if (cw > w) {
                this.zoom = w / cw;
                zoomElem.style.transform = "scale(" + this.zoom * zoomCorrectionFactor + ")";
            } else {
                this.zoom = 1;
                zoomElem.style.transform = "scale(" + this.zoom * zoomCorrectionFactor + ")";
            }
        });
    }

    update2() {
        // specify svg width and height;
        const width = 500, height = 500;
        const listenTo = Math.min(width, height);
// create svg and g DOM elements;
        let svg = d3.select(this.myReference.current)
            .append('svg')
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr('width', listenTo)
            .attr('height', listenTo)
            .append('g')
            // move 0,0 to the center
            .attr('transform', `translate(${width >> 1}, ${height >> 1})`);

        var images = [], maxImages = 200, maxWeight = 50, minWeight = 1, padding = 3;
        for (let i = 0; i < maxImages - 1; i++) {
            const weight = (Math.random() * (maxWeight - minWeight)) + minWeight;
            images.push({
                url: `https://via.placeholder.com/100?text=${Math.ceil(weight)}`,
                weight
            })
        }
// make one image with a weight 3 times bigger for visualization testing propouses
        images.push({
            url: `https://via.placeholder.com/100?text=${maxWeight * 3}`,
            weight: maxWeight * 3,
            fx: 0,
            fy: 0
        })
        images.sort((a, b) => b.weight - a.weight);

// make it so the biggest images is equal to 10% of canvas, and thre smallest one 1%
        let scl = ((100 / maxImages) / 100);
        let miisp = 0.1;
        if (scl <= miisp) scl = scl / maxImages;
        const maxImageSize = listenTo * miisp;
        const minImageSize = listenTo * scl;

// function to scale the images
        const scaleSize = d3.scaleLinear().domain([minWeight, maxWeight * 3]).range([minImageSize, maxImageSize]).clamp(true);

// append the rects
        let vizImages = svg.selectAll('.image-cloud-image')
            .data(images)
            .enter()
            .append('svg:image')
            .attr('class', '.image-cloud-image')
            .attr('height', d => scaleSize(d.weight))
            .attr('width', d => scaleSize(d.weight))
            .attr('id', d => d.url)
            .attr('xlink:href', d => d.url);
        vizImages.exit().remove();

// create the collection of forces
        const simulation = d3.forceSimulation()
            // set the nodes for the simulation to be our images
            .nodes(images)
            // set the function that will update the view on each 'tick'
            .on('tick', ticked)
            .force('center', d3.forceCenter())
            .force('cramp', d3.forceManyBody().strength(listenTo / 100))
            // collition force for rects
            .force('collide', rectCollide().size(d => {
                const s = scaleSize(d.weight);
                return [s + padding, s + padding];
            }));

// update the position to new x and y
        function ticked() {
            vizImages.attr('x', d => d.x).attr('y', d => d.y);
        }

// Rect collition algorithm. i don't know exactly how it works
// https://bl.ocks.org/cmgiven/547658968d365bcc324f3e62e175709b
        function rectCollide() {
            var nodes, sizes, masses
            var size = constant([0, 0])
            var strength = 1
            var iterations = 1

            function force() {
                var node, size, mass, xi, yi
                var i = -1
                while (++i < iterations) {
                    iterate()
                }

                function iterate() {
                    var j = -1
                    var tree = d3.quadtree(nodes, xCenter, yCenter).visitAfter(prepare)

                    while (++j < nodes.length) {
                        node = nodes[j]
                        size = sizes[j]
                        mass = masses[j]
                        xi = xCenter(node)
                        yi = yCenter(node)

                        tree.visit(apply)
                    }
                }

                function apply(quad, x0, y0, x1, y1) {
                    var data = quad.data
                    var xSize = (size[0] + quad.size[0]) / 2
                    var ySize = (size[1] + quad.size[1]) / 2
                    if (data) {
                        if (data.index <= node.index) {
                            return
                        }

                        var x = xi - xCenter(data)
                        var y = yi - yCenter(data)
                        var xd = Math.abs(x) - xSize
                        var yd = Math.abs(y) - ySize

                        if (xd < 0 && yd < 0) {
                            var l = Math.sqrt(x * x + y * y)
                            var m = masses[data.index] / (mass + masses[data.index])

                            if (Math.abs(xd) < Math.abs(yd)) {
                                node.vx -= (x *= xd / l * strength) * m
                                data.vx += x * (1 - m)
                            } else {
                                node.vy -= (y *= yd / l * strength) * m
                                data.vy += y * (1 - m)
                            }
                        }
                    }

                    return x0 > xi + xSize || y0 > yi + ySize ||
                        x1 < xi - xSize || y1 < yi - ySize
                }

                function prepare(quad) {
                    if (quad.data) {
                        quad.size = sizes[quad.data.index]
                    } else {
                        quad.size = [0, 0]
                        var i = -1
                        while (++i < 4) {
                            if (quad[i] && quad[i].size) {
                                quad.size[0] = Math.max(quad.size[0], quad[i].size[0])
                                quad.size[1] = Math.max(quad.size[1], quad[i].size[1])
                            }
                        }
                    }
                }
            }

            function xCenter(d) {
                return d.x + d.vx + sizes[d.index][0] / 2
            }

            function yCenter(d) {
                return d.y + d.vy + sizes[d.index][1] / 2
            }

            force.initialize = function (_) {
                sizes = (nodes = _).map(size)
                masses = sizes.map(function (d) {
                    return d[0] * d[1]
                })
            }

            force.size = function (_) {
                return (arguments.length
                    ? (size = typeof _ === 'function' ? _ : constant(_), force)
                    : size)
            }

            force.strength = function (_) {
                return (arguments.length ? (strength = +_, force) : strength)
            }

            force.iterations = function (_) {
                return (arguments.length ? (iterations = +_, force) : iterations)
            }

            return force
        }

        function constant(_) {
            return function () {
                return _
            }
        }

    }
}

function mapStateToProps(state) {
    return {
        currentImages: state.imagesReducer
    }
}

export default connect(mapStateToProps)(ImageCloud2);
