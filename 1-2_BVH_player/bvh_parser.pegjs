

start
= h:hierarchy m:motion {
    return {
        "hierarchy": h,
        "motion": m,
    }
}

WS
= [ \t]*

INT
= n:$( "-"? [0-9]+ ) { return parseInt(n, 10); }

FLOAT
= n:$( "-"? [0-9]+ "." [0-9]* ( "e"i $( "-"? [0-9]+ ) )? ) { return parseFloat(n); }

NUMBER
= FLOAT / INT

NAME
= $[a-z]i+

hierarchy
= "HIERARCHY" WS @root

root
= "ROOT" WS n:node {
    n.type = "root"
    return n
}

link
= joint / end


joint
= "JOINT" WS n:node {
    n.type = "joint"
    return n
}

node
= node_name:NAME WS 
    "{" WS 
        "OFFSET" WS joint_offset:NUMBER[3, WS] WS 
        "CHANNELS" WS num_channels:INT WS channels:NAME[.., WS] WS 
        links:link[1.., WS] WS 
    "}" 

    {
        return {
            "name": node_name,
            "offset": joint_offset,
            "num_channels": num_channels,
            "channels": channels,
            "conn_links": links,
        };
    }

end
= "END" WS node_name:NAME WS 
    "{" WS 
        "OFFSET" WS joint_offset:NUMBER[3, WS] WS 
    "}" 

    {
        return {
            "name": node_name,
            "type": "end",
            "offset": joint_offset,
        };
    }


motion
= "MOTION" WS frames: